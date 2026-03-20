# app.py

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import random
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
import re
from datetime import datetime, timedelta

# --- Database Configuration ---
# Fixed to uz1gfre as per your verification
DATABASE_URL = "mongodb+srv://krishna:destroyer1357@smartnav.uz1gfre.mongodb.net/univerge_data?retryWrites=true&w=majority"
DB_NAME = 'univerge_data'
load_dotenv() # This looks for a local .env file

# This tells the app to look for the variables you just typed into Render
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# --- MongoDB Setup (CRITICAL FIX: Define variables globally first) ---
users_collection = None
mentorship_slots_collection = None
resources_collection = None
confidence_corner_posts_collection = None

try:
    client = MongoClient(DATABASE_URL)
    db = client[DB_NAME]
    
    # Assign the collections to the global labels
    users_collection = db.users
    mentorship_slots_collection = db.mentorship_slots
    resources_collection = db.resources
    confidence_corner_posts_collection = db.confidence_corner_posts
    
    users_collection.create_index("email", unique=True)
    print(f"Successfully connected to MongoDB: {DB_NAME}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# --- Global current_user (for session simulation in this demo) ---
current_user = None

# --- Custom Static Route for JavaScript files ---
@app.route('/script/<path:filename>')
def serve_script_static(filename):
    script_dir = os.path.join(app.root_path, 'script')
    return send_from_directory(script_dir, filename)

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
    
    # Convert datetime objects to ISO format strings for JSON
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

@app.route('/api/login', methods=['POST'])
def login():
    global current_user
    if users_collection is None:
        return jsonify({"message": "Database connecting... please try again in 5 seconds.", "success": False}), 503
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user_doc = users_collection.find_one({"email": email, "password": password})

    if user_doc:
        current_user = doc_to_dict(user_doc)
        return jsonify({"message": f"Welcome, {current_user['name']}!", "user": current_user, "success": True}), 200
    else:
        return jsonify({"message": "Invalid email or password.", "success": False}), 401

@app.route('/api/register', methods=['POST'])
def register():
    global current_user
    if users_collection is None:
        return jsonify({"message": "Database connecting...", "success": False}), 503

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    user_type = data.get('type')
    hometown = data.get('hometown')
    language = data.get('language')

    if not all([email, password, name, user_type, hometown, language]):
        return jsonify({"message": "All fields are required.", "success": False}), 400
    if user_type not in ['student', 'alumni']:
        return jsonify({"message": "Invalid user type.", "success": False}), 400

    new_user_data = {
        "email": email,
        "password": password, 
        "name": name,
        "type": user_type,
        "hometown": hometown,
        "language": language,
        "profession": data.get('profession', None) if user_type == 'alumni' else None
    }

    try:
        result = users_collection.insert_one(new_user_data)
        new_user_doc = users_collection.find_one({"_id": result.inserted_id})
        current_user = doc_to_dict(new_user_doc)
        return jsonify({"message": f"Registration successful! Welcome!", "user": current_user, "success": True}), 201
    except DuplicateKeyError:
        return jsonify({"message": "Email already registered.", "success": False}), 409
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify({"message": f"Server Error: {str(e)}", "success": False}), 500

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

@app.route('/api/simulate_match', methods=['POST'])
def simulate_match():
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"message": "Only students can simulate matches.", "success": False}), 403

    potential_mentors_docs = list(users_collection.find({
        "type": "alumni",
        "hometown": current_user.get('hometown'),
        "language": current_user.get('language')
    }))

    if potential_mentors_docs:
        matched_alumni_doc = random.choice(potential_mentors_docs)
        matched_alumni_data = doc_to_dict(matched_alumni_doc)
        matched_alumni_data.pop('password', None) 
        return jsonify({"message": "Match found!", "match": matched_alumni_data, "success": True}), 200
    else:
        return jsonify({"message": "No direct match found yet.", "success": False}), 200
    
@app.route('/api/storyboards', methods=['GET'])
def get_storyboards():
    alumni_users_docs = list(users_collection.find({"type": "alumni", "story": {"$exists": True, "$ne": None, "$ne": ""}}))
    alumni_stories = []
    for u_doc in alumni_users_docs:
        alumni_dict = doc_to_dict(u_doc)
        alumni_stories.append({
            "name": alumni_dict['name'],
            "profession": alumni_dict.get('profession', 'Alumni'),
            "hometown": alumni_dict['hometown'],
            "story": alumni_dict['story'],
            "story_title": alumni_dict.get('story_title', 'My Journey'),
            "image_url": alumni_dict.get('story_image', '')
        })
    return jsonify({"storyboards": alumni_stories, "success": True}), 200

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    global current_user
    if not current_user:
        return jsonify({"message": "Authentication required.", "success": False}), 401
    data = request.get_json()
    update_fields = {k: v for k, v in data.items() if k in ['hometown', 'language', 'profession']}

    try:
        users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$set": update_fields})
        updated_user_doc = users_collection.find_one({"_id": ObjectId(current_user['id'])})
        current_user = doc_to_dict(updated_user_doc)
        return jsonify({"message": "Profile updated!", "user": current_user, "success": True}), 200
    except Exception as e:
        return jsonify({"message": "Update failed.", "success": False}), 500

@app.route('/api/storyboards/create', methods=['POST'])
def create_storyboard():
    global current_user 
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Alumni only.", "success": False}), 403
    data = request.get_json()
    try:
        update_data = {"story": data.get('description'), "story_title": data.get('title'), "story_image": data.get('image_url')}
        users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$set": update_data})
        current_user = doc_to_dict(users_collection.find_one({"_id": ObjectId(current_user['id'])}))
        return jsonify({"message": "Journey shared!", "success": True}), 201
    except Exception as e:
        return jsonify({"message": "Error.", "success": False}), 500

@app.route('/impact-tracker-dummy-content')
def serve_impact_tracker_dummy_content():
    file_path = os.path.join(app.root_path, app.template_folder, 'impact_tracker_dummy.html')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            full_html = f.read()
        main_content_match = re.search(r'<main[^>]*>(.*?)</main>', full_html, re.DOTALL)
        return main_content_match.group(1) if main_content_match else "Content not found."
    except Exception as e:
        return f"Error: {str(e)}", 500

@app.route('/api/slots/create', methods=['POST'])
def create_mentorship_slot():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False}), 403
    data = request.get_json()
    try:
        start_time = datetime.strptime(f"{data.get('date')} {data.get('time')}", '%Y-%m-%d %H:%M')
        new_slot = {
            "alumni_id": ObjectId(current_user['id']), "alumni_name": current_user['name'],
            "start_time": start_time, "end_time": start_time + timedelta(minutes=int(data.get('duration', 30))),
            "duration_minutes": int(data.get('duration', 30)), "is_booked": False, "student_id": None, "student_name": None
        }
        mentorship_slots_collection.insert_one(new_slot)
        return jsonify({"message": "Slot created!", "success": True}), 201
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@app.route('/api/slots/available', methods=['GET'])
def get_available_slots():
    slots = list(mentorship_slots_collection.find({"is_booked": False, "start_time": {"$gte": datetime.now()}}).sort("start_time", 1))
    return jsonify({"slots": [doc_to_dict(s) for s in slots], "success": True}), 200

@app.route('/api/slots/my', methods=['GET'])
def get_my_slots():
    if not current_user: return jsonify({"success": False}), 401
    slots = list(mentorship_slots_collection.find({"$or": [{"alumni_id": ObjectId(current_user['id'])}, {"student_id": ObjectId(current_user['id'])}]}))
    data = []
    for s in slots:
        d = doc_to_dict(s)
        d['is_my_alumni_slot'] = (str(d['alumni_id']) == current_user['id'])
        data.append(d)
    return jsonify({"slots": data, "success": True}), 200

@app.route('/api/slots/book/<string:slot_id>', methods=['POST'])
def book_mentorship_slot(slot_id):
    if not current_user or current_user['type'] != 'student': return jsonify({"success": False}), 403
    mentorship_slots_collection.update_one({"_id": ObjectId(slot_id)}, {"$set": {"is_booked": True, "student_id": ObjectId(current_user['id']), "student_name": current_user['name']}})
    return jsonify({"message": "Booked!", "success": True}), 200

@app.route('/api/resources/create', methods=['POST'])
def create_resource():
    if not current_user or current_user['type'] != 'alumni': return jsonify({"success": False}), 403
    data = request.get_json()
    res = {
        "title": data.get('title'), "url": data.get('url'), "category": data.get('category'), "description": data.get('description'),
        "alumni_id": ObjectId(current_user['id']), "alumni_name": current_user['name'],
        "alumni_hometown": current_user.get('hometown'), "alumni_language": current_user.get('language'), "created_at": datetime.now()
    }
    resources_collection.insert_one(res)
    return jsonify({"message": "Uploaded!", "success": True}), 201

@app.route('/api/resources', methods=['GET'])
def get_resources():
    query = {}
    if current_user and current_user['type'] == 'student':
        if current_user.get('hometown'): query["alumni_hometown"] = current_user.get('hometown')
    docs = list(resources_collection.find(query).sort("created_at", -1))
    return jsonify({"resources": [doc_to_dict(d) for d in docs], "success": True}), 200

@app.route('/api/confidence_corner/post', methods=['POST'])
def create_confidence_post():
    if not current_user: return jsonify({"success": False}), 401
    data = request.get_json()
    confidence_corner_posts_collection.insert_one({
        "user_id": ObjectId(current_user['id']), "content": data.get('content'), "created_at": datetime.now(), "is_deleted": False
    })
    return jsonify({"message": "Posted!", "success": True}), 201

@app.route('/api/confidence_corner/posts', methods=['GET'])
def get_confidence_posts():
    docs = list(confidence_corner_posts_collection.find({"is_deleted": False}).sort("created_at", -1))
    return jsonify({"posts": [doc_to_dict(d) for d in docs], "success": True}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)