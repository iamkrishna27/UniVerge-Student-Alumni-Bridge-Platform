# app.py

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import random
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
import re
from datetime import datetime, timedelta
# Added for secure file handling
from werkzeug.utils import secure_filename

# --- Database Configuration ---
DATABASE_URL = "mongodb+srv://krishna:destroyer1357@smartnav.uz1gfre.mongodb.net/univerge_data?retryWrites=true&w=majority"
DB_NAME = 'univerge_data'

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# --- File Upload Configuration ---
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Ensure the physical folder exists on the server
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

# --- MongoDB Setup ---
users_collection = None
mentorship_slots_collection = None
resources_collection = None
confidence_corner_posts_collection = None

try:
    client = MongoClient(DATABASE_URL)
    db = client[DB_NAME]
    
    users_collection = db.users
    mentorship_slots_collection = db.mentorship_slots
    resources_collection = db.resources
    confidence_corner_posts_collection = db.confidence_corner_posts
    
    users_collection.create_index("email", unique=True)
    print(f"Successfully connected to MongoDB: {DB_NAME}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# --- Global current_user (for session simulation) ---
current_user = None

# --- Helper to convert MongoDB ObjectId to string for JSON response ---
def doc_to_dict(doc):
    if not doc:
        return None
    doc_dict = {k: v for k, v in doc.items() if k != '_id'}
    doc_dict['id'] = str(doc['_id'])
    
    if 'alumni_id' in doc_dict and isinstance(doc_dict['alumni_id'], ObjectId):
        doc_dict['alumni_id'] = str(doc_dict['alumni_id'])
    if 'student_id' in doc_dict and isinstance(doc_dict['student_id'], ObjectId):
        doc_dict['student_id'] = str(doc_dict['student_id'])
    if 'user_id' in doc_dict and isinstance(doc_dict['user_id'], ObjectId): 
        doc_dict['user_id'] = str(doc_dict['user_id'])
    
    if 'start_time' in doc_dict and isinstance(doc_dict['start_time'], datetime):
        doc_dict['start_time'] = doc_dict['start_time'].isoformat()
    if 'end_time' in doc_dict and isinstance(doc_dict['end_time'], datetime):
        doc_dict['end_time'] = doc_dict['end_time'].isoformat()
    if 'created_at' in doc_dict and isinstance(doc_dict['created_at'], datetime): 
        doc_dict['created_at'] = doc_dict['created_at'].isoformat()

    return doc_dict

# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html')

# --- Static Serving ---
@app.route('/script/<path:filename>')
def serve_script_static(filename):
    script_dir = os.path.join(app.root_path, 'script')
    return send_from_directory(script_dir, filename)

# Route to let students download physical files
@app.route('/uploads/<filename>')
def downloaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Auth Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    global current_user
    if users_collection is None:
        return jsonify({"message": "Database connecting...", "success": False}), 503
        
    data = request.get_json()
    user_doc = users_collection.find_one({"email": data.get('email'), "password": data.get('password')})

    if user_doc:
        current_user = doc_to_dict(user_doc)
        return jsonify({"message": f"Welcome, {current_user['name']}!", "user": current_user, "success": True}), 200
    return jsonify({"message": "Invalid email or password.", "success": False}), 401

@app.route('/api/register', methods=['POST'])
def register():
    global current_user
    data = request.get_json()
    
    new_user_data = {
        "email": data.get('email'), "password": data.get('password'), "name": data.get('name'),
        "type": data.get('type'), "hometown": data.get('hometown'), "language": data.get('language'),
        "profession": data.get('profession', None) if data.get('type') == 'alumni' else None
    }

    try:
        result = users_collection.insert_one(new_user_data)
        current_user = doc_to_dict(users_collection.find_one({"_id": result.inserted_id}))
        return jsonify({"message": "Registration successful!", "user": current_user, "success": True}), 201
    except DuplicateKeyError:
        return jsonify({"message": "Email already registered.", "success": False}), 409

@app.route('/api/logout', methods=['POST'])
def logout():
    global current_user
    current_user = None
    return jsonify({"message": "Logged out successfully.", "success": True}), 200

@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    if current_user:
        return jsonify({"user": current_user, "success": True}), 200
    return jsonify({"message": "No user logged in.", "success": False}), 401

# --- Mentorship & Profile Routes ---

@app.route('/api/simulate_match', methods=['POST'])
def simulate_match():
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False}), 403

    potential = list(users_collection.find({"type": "alumni", "hometown": current_user.get('hometown')}))
    if potential:
        match = doc_to_dict(random.choice(potential))
        match.pop('password', None) 
        return jsonify({"match": match, "success": True}), 200
    return jsonify({"message": "No match found.", "success": False}), 200

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    global current_user
    if not current_user: return jsonify({"success": False}), 401
    data = request.get_json()
    users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$set": data})
    current_user = doc_to_dict(users_collection.find_one({"_id": ObjectId(current_user['id'])}))
    return jsonify({"user": current_user, "success": True}), 200

# --- Resource Bank (REWRITTEN FOR FILE UPLOADS) ---

@app.route('/api/resources/create', methods=['POST'])
def create_resource():
    global current_user
    # Security check: Must be an alumni to upload
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    # Use request.files for the document and request.form for the text data
    file = request.files.get('file')
    title = request.form.get('title')
    category = request.form.get('category')
    description = request.form.get('description')
    
    if file and title:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path) # Physically save file to 'uploads/'
        
        res = {
            "title": title,
            "url": f"/uploads/{filename}", # Store the download link
            "category": category,
            "description": description,
            "alumni_id": ObjectId(current_user['id']),
            "alumni_name": current_user['name'],
            "created_at": datetime.now()
        }
        resources_collection.insert_one(res)
        return jsonify({"success": True, "message": "Resource shared successfully!"}), 201
        
    return jsonify({"success": False, "message": "Missing file or title"}), 400

@app.route('/api/resources', methods=['GET'])
def get_resources():
    docs = list(resources_collection.find().sort("created_at", -1))
    return jsonify({"resources": [doc_to_dict(d) for d in docs], "success": True}), 200

# --- Mentorship Slots ---

@app.route('/api/slots/create', methods=['POST'])
def create_mentorship_slot():
    global current_user
    if not current_user or current_user['type'] != 'alumni': return jsonify({"success": False}), 403
    data = request.get_json()
    try:
        start_time = datetime.strptime(f"{data.get('date')} {data.get('time')}", '%Y-%m-%d %H:%M')
        new_slot = {
            "alumni_id": ObjectId(current_user['id']), "alumni_name": current_user['name'],
            "start_time": start_time, "duration_minutes": int(data.get('duration', 30)), "is_booked": False
        }
        mentorship_slots_collection.insert_one(new_slot)
        return jsonify({"success": True}), 201
    except Exception as e: return jsonify({"message": str(e), "success": False}), 500

@app.route('/api/slots/available', methods=['GET'])
def get_available_slots():
    slots = list(mentorship_slots_collection.find({"is_booked": False, "start_time": {"$gte": datetime.now()}}).sort("start_time", 1))
    return jsonify({"slots": [doc_to_dict(s) for s in slots], "success": True}), 200

# NEW: API to book a slot
@app.route('/api/slots/book/<slot_id>', methods=['POST'])
def book_slot(slot_id):
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"message": "Only students can book slots.", "success": False}), 403

    result = mentorship_slots_collection.update_one(
        {"_id": ObjectId(slot_id), "is_booked": False},
        {"$set": {
            "is_booked": True,
            "student_id": ObjectId(current_user['id']),
            "student_name": current_user['name']
        }}
    )
    
    if result.modified_count > 0:
        return jsonify({"success": True, "message": "Slot successfully booked!"}), 200
    return jsonify({"success": False, "message": "Slot is already taken or unavailable."}), 400

# NEW: API to get a user's specific slots
@app.route('/api/slots/my', methods=['GET'])
def get_my_slots():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    # If alumni, find slots they created. If student, find slots they booked.
    if current_user['type'] == 'alumni':
        query = {"alumni_id": ObjectId(current_user['id'])}
    else:
        query = {"student_id": ObjectId(current_user['id'])}
        
    slots = list(mentorship_slots_collection.find(query).sort("start_time", 1))
    return jsonify({"slots": [doc_to_dict(s) for s in slots], "success": True}), 200

# --- Confidence Corner ---

@app.route('/api/confidence_corner/post', methods=['POST'])
def create_confidence_post():
    if not current_user: return jsonify({"success": False}), 401
    data = request.get_json()
    confidence_corner_posts_collection.insert_one({
        "user_id": ObjectId(current_user['id']), "content": data.get('content'), "created_at": datetime.now(), "is_deleted": False
    })
    return jsonify({"success": True}), 201

@app.route('/api/confidence_corner/posts', methods=['GET'])
def get_confidence_posts():
    docs = list(confidence_corner_posts_collection.find({"is_deleted": False}).sort("created_at", -1))
    return jsonify({"posts": [doc_to_dict(d) for d in docs], "success": True}), 200

# --- Storyboards & Impact ---

@app.route('/api/storyboards', methods=['GET'])
def get_storyboards():
    alumni = list(users_collection.find({"type": "alumni", "story": {"$exists": True}}))
    stories = [{"name": a['name'], "story": a['story'], "story_title": a.get('story_title')} for a in alumni]
    return jsonify({"storyboards": stories, "success": True}), 200

@app.route('/impact-tracker-dummy-content')
def serve_impact_tracker_dummy_content():
    file_path = os.path.join(app.root_path, app.template_folder, 'impact_tracker_dummy.html')
    with open(file_path, 'r', encoding='utf-8') as f:
        return re.search(r'<main[^>]*>(.*?)</main>', f.read(), re.DOTALL).group(1)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)