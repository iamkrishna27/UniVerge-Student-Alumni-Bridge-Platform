# app.py

from flask import Flask, render_template, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
import os
import random
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
import re
from datetime import datetime, timedelta
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
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

# --- MongoDB Setup ---
users_collection = None
mentorship_slots_collection = None
resources_collection = None
confidence_corner_posts_collection = None
reports_collection = None  # 1. Make sure it's declared here
mentorship_connections_collection = None
messages_collection = None

try:
    client = MongoClient(DATABASE_URL)
    db = client[DB_NAME]
    
    users_collection = db.users
    mentorship_slots_collection = db.mentorship_slots
    resources_collection = db.resources
    confidence_corner_posts_collection = db.confidence_corner_posts
    
    # 2. THIS IS THE MISSING LINE! Connect it to the database:
    reports_collection = db.reports 
    mentorship_connections_collection = db.mentorship_connections
    messages_collection = db.messages
    
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

# --- Helper: Recent activity friendly timestamp ---

def format_time_ago(dt):
    if not isinstance(dt, datetime):
        return 'Just now'
    diff = datetime.now() - dt
    seconds = diff.total_seconds()
    if seconds < 60:
        return 'Just now'
    if seconds < 3600:
        minutes = int(seconds // 60)
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    if seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = int(seconds // 86400)
    if days < 7:
        return f"{days} day{'s' if days != 1 else ''} ago"
    return dt.strftime('%Y-%m-%d')

# --- Routes ---

@app.route('/')
def index():
    if current_user:
        if current_user.get('type') == 'student':
            return redirect('/student/dashboard')
        elif current_user.get('type') == 'alumni':
            return redirect('/alumni/dashboard')
    return render_template('index.html')

@app.route('/student/dashboard')
@app.route('/alumni/dashboard')
def dashboard_route():
    if not current_user:
        return redirect('/')
    if request.path == '/student/dashboard' and current_user.get('type') != 'student':
        return redirect('/')
    if request.path == '/alumni/dashboard' and current_user.get('type') != 'alumni':
        return redirect('/')
    return render_template('index.html')

@app.route('/chat')
def chat_route():
    return render_template('chat.html')

@app.route('/script/<path:filename>')
def serve_script_static(filename):
    script_dir = os.path.join(app.root_path, 'script')
    return send_from_directory(script_dir, filename)

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

@app.route('/api/profile', methods=['GET'])
def get_profile():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    user_doc = users_collection.find_one({"_id": ObjectId(current_user['id'])})
    if not user_doc:
        return jsonify({"success": False, "message": "User not found"}), 404
    current_user = doc_to_dict(user_doc)
    return jsonify({"user": current_user, "success": True}), 200

@app.route('/api/profile/alumni/<alumni_id>', methods=['GET'])
def get_alumni_profile(alumni_id):
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(alumni_id), "type": "alumni"})
        if not user_doc:
            return jsonify({"success": False, "message": "Alumni not found"}), 404
            
        profile_data = {
            "id": str(user_doc['_id']),
            "name": user_doc.get('name', ''),
            "profile_image": user_doc.get('profile_image', ''),
            "role": user_doc.get('profession') or user_doc.get('designation', ''),
            "company": user_doc.get('company_name', ''),
            "experience": user_doc.get('experience_years', ''),
            "location": user_doc.get('company_location') or user_doc.get('hometown', ''),
            "skills": user_doc.get('skills', ''),
            "bio": user_doc.get('bio', ''),
            "linkedin": user_doc.get('linkedin', ''),
            "available_for": user_doc.get('available_for', '')
        }
        
        connection_status = "none"
        connection_id = None
        if current_user and current_user['type'] == 'student':
            conn = db.mentorship_connections.find_one({"student_id": current_user['id'], "alumni_id": alumni_id})
            if conn:
                connection_status = "connected"
                connection_id = str(conn['_id'])
            else:
                req = db.mentorship_requests.find_one({"student_id": current_user['id'], "alumni_id": alumni_id, "status": "pending"})
                if req:
                    connection_status = "pending"
                    
        profile_data['connection_status'] = connection_status
        profile_data['connection_id'] = connection_id
        return jsonify({"profile": profile_data, "success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/profile/student/<student_id>', methods=['GET'])
def get_student_profile(student_id):
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(student_id), "type": "student"})
        if not user_doc:
            return jsonify({"success": False, "message": "Student not found"}), 404
            
        profile_data = {
            "id": str(user_doc['_id']),
            "name": user_doc.get('name', ''),
            "profile_image": user_doc.get('profile_image', ''),
            "department": user_doc.get('department', ''),
            "year": user_doc.get('year', ''),
            "college": user_doc.get('college', ''),
            "skills": user_doc.get('skills', ''),
            "bio": user_doc.get('bio', ''),
            "career_interests": user_doc.get('career_interests', ''),
            "projects": user_doc.get('projects', []),
            "github": user_doc.get('github', ''),
            "portfolio": user_doc.get('portfolio', ''),
            "linkedin": user_doc.get('linkedin', '')
        }

        connection_status = "none"
        connection_id = None
        if current_user and current_user['type'] == 'alumni':
            conn = db.mentorship_connections.find_one({"alumni_id": current_user['id'], "student_id": student_id})
            if conn:
                connection_status = "connected"
                connection_id = str(conn['_id'])
            else:
                req = db.mentorship_requests.find_one({"alumni_id": current_user['id'], "student_id": student_id, "status": "pending"})
                if req:
                    connection_status = "pending"
                    
        profile_data['connection_status'] = connection_status
        profile_data['connection_id'] = connection_id
        return jsonify({"profile": profile_data, "success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400



@app.route('/api/profile', methods=['PUT'])
def update_profile():
    global current_user
    if not current_user:
        return jsonify({"success": False}), 401
    data = request.get_json()
    valid_fields = [
        'hometown', 'language', 'profession', 'company_name', 'designation', 'experience_years',
        'company_location', 'bio', 'skills', 'available_for', 'linkedin', 'github', 'portfolio',
        'profile_image'
    ]
    update_data = {k: v for k, v in data.items() if k in valid_fields}
    if update_data:
        users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$set": update_data})
        current_user = doc_to_dict(users_collection.find_one({"_id": ObjectId(current_user['id'])}))
    return jsonify({"user": current_user, "success": True}), 200


@app.route('/api/profile/upload-photo', methods=['POST'])
def upload_profile_photo():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    if 'profile_image' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['profile_image']
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    allowed_ext = {'png', 'jpg', 'jpeg'}
    filename = secure_filename(file.filename)
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

    if ext not in allowed_ext:
        return jsonify({"success": False, "message": "Only JPG and PNG are allowed"}), 400

    save_name = f"{current_user['id']}_profile.{ext}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], save_name)
    file.save(file_path)

    profile_image_url = f"/uploads/{save_name}"
    users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$set": {"profile_image": profile_image_url}})
    current_user['profile_image'] = profile_image_url

    return jsonify({"success": True, "profile_image": profile_image_url, "user": current_user}), 200


@app.route('/api/profile/remove-photo', methods=['POST'])
def remove_profile_photo():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_doc = users_collection.find_one({"_id": ObjectId(current_user['id'])})
    if user_doc and user_doc.get('profile_image'):
        existing = user_doc.get('profile_image')
        if existing.startswith('/uploads/'):
            path = existing.replace('/uploads/', '')
            full_path = os.path.join(app.config['UPLOAD_FOLDER'], path)
            if os.path.exists(full_path):
                try:
                    os.remove(full_path)
                except Exception:
                    pass

    users_collection.update_one({"_id": ObjectId(current_user['id'])}, {"$unset": {"profile_image": ''}})
    current_user['profile_image'] = None

    return jsonify({"success": True, "message": "Profile photo removed", "user": current_user}), 200


# --- Resource Bank ---

@app.route('/api/resources/create', methods=['POST'])
def create_resource():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    file = request.files.get('file')
    title = request.form.get('title')
    category = request.form.get('category')
    description = request.form.get('description')
    
    if file and title:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        res = {
            "title": title,
            "url": f"/uploads/{filename}",
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
    if not current_user or current_user['type'] != 'alumni': 
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    
    data = request.get_json()
    try:
        start_time = datetime.strptime(f"{data.get('date')} {data.get('time')}", '%Y-%m-%d %H:%M')
        new_slot = {
            "alumni_id": ObjectId(current_user['id']), 
            "alumni_name": current_user['name'],
            "start_time": start_time, 
            "duration_minutes": int(data.get('duration', 30)), 
            "is_booked": False,
            "meeting_link": data.get('meeting_link', '')
        }
        mentorship_slots_collection.insert_one(new_slot)
        return jsonify({"success": True}), 201
    except Exception as e: 
        print("Error creating slot:", str(e))
        return jsonify({"message": str(e), "success": False}), 500  
    
@app.route('/api/slots/available', methods=['GET'])
def get_available_slots():
    slots = list(mentorship_slots_collection.find({"is_booked": False, "start_time": {"$gte": datetime.now()}}).sort("start_time", 1))
    return jsonify({"slots": [doc_to_dict(s) for s in slots], "success": True}), 200

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

@app.route('/api/slots/my', methods=['GET'])
def get_my_slots():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
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

# --- Storyboards ---

@app.route('/api/storyboards/create', methods=['POST'])
def create_story():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Only alumni can post stories."}), 403
    
    data = request.get_json()
    new_story = {
        "alumni_id": ObjectId(current_user['id']),
        "name": current_user['name'],
        "profession": current_user.get('profession', 'Alumni'),
        "hometown": current_user.get('hometown', ''),
        "story_title": data.get('title'),
        "story": data.get('description'),
        "image_url": data.get('image_url', ''), 
        "created_at": datetime.now()
    }
    
    db.stories.insert_one(new_story) 
    return jsonify({"success": True, "message": "Story published!"}), 201

@app.route('/api/storyboards', methods=['GET'])
def get_storyboards():
    docs = list(db.stories.find().sort("created_at", -1))
    return jsonify({"storyboards": [doc_to_dict(d) for d in docs], "success": True}), 200

# --- Phase 2: Alumni Search & Feedback ---

@app.route('/api/alumni', methods=['GET'])
def search_alumni():
    global current_user
    req_user = request.args.get('user_id') or (current_user['id'] if current_user else None)
    search_term = request.args.get('search', '').lower()
    
    exclude_alumni_ids = set()
    if req_user:
        student_id = ObjectId(req_user)
        for r in db.mentorship_requests.find({"student_id": student_id, "status": {"$in": ["pending", "accepted"]}}):
            exclude_alumni_ids.add(str(r['alumni_id']))
        for c in db.mentorship_connections.find({"student_id": student_id}):
            exclude_alumni_ids.add(str(c['alumni_id']))

    alumni_list = list(users_collection.find({"type": "alumni"}))
    
    results = []
    now = datetime.now()
    
    for al in alumni_list:
        if str(al['_id']) in exclude_alumni_ids:
            continue
            
        name = al.get('name', '').lower()
        prof = (al.get('profession') or '').lower()
        
        if search_term in name or search_term in prof:
            al_dict = doc_to_dict(al)
            al_dict.pop('password', None)
            
            # Check if they pinged the server in the last 5 minutes (300 seconds)
            last_active = al.get('last_active')
            is_online = False
            if last_active and isinstance(last_active, datetime):
                if (now - last_active).total_seconds() < 300:
                    is_online = True
                    
            al_dict['is_online'] = is_online
            results.append(al_dict)

    return jsonify({"alumni": results, "success": True}), 200

@app.route('/api/feedback/<slot_id>', methods=['POST'])
def submit_feedback(slot_id):
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False, "message": "Only students can leave feedback."}), 403

    data = request.get_json()
    feedback_doc = {
        "slot_id": ObjectId(slot_id),
        "student_id": ObjectId(current_user['id']),
        "student_name": current_user['name'],
        "rating": data.get('rating'),
        "review": data.get('review'),
        "created_at": datetime.now()
    }
    
    db.feedback.insert_one(feedback_doc)
    mentorship_slots_collection.update_one({"_id": ObjectId(slot_id)}, {"$set": {"is_reviewed": True}})

    return jsonify({"success": True, "message": "Thank you for your feedback!"}), 201



# --- Phase 3: Moderation & Reporting ---

@app.route('/api/reports', methods=['POST'])
def submit_report():
    global current_user
    if not current_user:
        return jsonify({"success": False, "message": "You must be logged in to submit a report."}), 401

    data = request.get_json()
    
    new_report = {
        "reporter_id": ObjectId(current_user['id']),
        "reporter_name": current_user['name'],
        # Use ObjectId if a valid ID is passed, otherwise None
        "reported_user_id": ObjectId(data.get('reported_user_id')) if data.get('reported_user_id') else None,
        "content_id": ObjectId(data.get('content_id')) if data.get('content_id') else None,
        "content_type": data.get('content_type', 'general'), # e.g., 'post', 'profile', 'message'
        "reason": data.get('reason'),
        "details": data.get('details', ''),
        "status": "pending",
        "created_at": datetime.now()
    }
    
    try:
        reports_collection.insert_one(new_report)
        return jsonify({"success": True, "message": "Report submitted successfully. Our team will review it."}), 201
    except Exception as e:
        print(f"Report Error: {e}")
        return jsonify({"success": False, "message": "An error occurred while submitting the report."}), 500
    
# ==========================================
# NEW FEATURES: Edit/Delete, Ping, & Status
# ==========================================

# 1. Edit a Story
@app.route('/api/storyboards/<story_id>', methods=['PUT'])
def edit_story(story_id):
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
        
    data = request.get_json()
    result = db.stories.update_one(
        {"_id": ObjectId(story_id), "alumni_id": ObjectId(current_user['id'])},
        {"$set": {"story_title": data.get('title'), "story": data.get('description')}}
    )
    
    if result.modified_count > 0:
        return jsonify({"success": True, "message": "Story updated!"})
    return jsonify({"success": False, "message": "Story not found or unauthorized."}), 404

# 2. Delete a Story
@app.route('/api/storyboards/<story_id>', methods=['DELETE'])
def delete_story(story_id):
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
        
    result = db.stories.delete_one({"_id": ObjectId(story_id), "alumni_id": ObjectId(current_user['id'])})
    if result.deleted_count > 0:
        return jsonify({"success": True, "message": "Story deleted!"})
    return jsonify({"success": False, "message": "Story not found or unauthorized."}), 404

# 3. User "Heartbeat" (Ping) to track Online Status
@app.route('/api/ping', methods=['POST'])
def ping():
    global current_user
    if current_user:
        # Update their last active time in the database
        users_collection.update_one(
            {"_id": ObjectId(current_user['id'])}, 
            {"$set": {"last_active": datetime.now()}}
        )
    return jsonify({"success": True})

# --- Job Opportunities ---

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    docs = list(db.jobs.find().sort("created_at", -1))
    return jsonify({"jobs": [doc_to_dict(d) for d in docs], "success": True}), 200

@app.route('/api/jobs', methods=['POST'])
def create_job():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Only alumni can post jobs."}), 403
    
    data = request.get_json()
    new_job = {
        "alumni_id": ObjectId(current_user['id']),
        "alumni_name": current_user['name'],
        "title": data.get('title'),
        "company": data.get('company'),
        "location": data.get('location'),
        "type": data.get('type'),
        "description": data.get('description'),
        "application_link": data.get('application_link'),
        "contact_email": data.get('contact_email'),
        "experience_level": data.get('experience_level'),
        "required_skills": data.get('required_skills'),
        "compensation_type": data.get('compensation_type'),
        "salary_range": data.get('salary_range'),
        "application_deadline": data.get('application_deadline'),
        "joining_date": data.get('joining_date'),
        "created_at": datetime.now()
    }
    
    db.jobs.insert_one(new_job)
    return jsonify({"success": True, "message": "Job posted successfully!"}), 201

@app.route('/api/jobs/<job_id>/apply', methods=['POST'])
def apply_job(job_id):
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False, "message": "Only students can apply for jobs."}), 403

    existing = db.applications.find_one({"job_id": ObjectId(job_id), "student_id": ObjectId(current_user['id'])})
    if existing:
        return jsonify({"success": False, "message": "You have already applied for this position."}), 400

    new_app = {
        "job_id": ObjectId(job_id),
        "student_id": ObjectId(current_user['id']),
        "student_name": current_user['name'],
        "applied_at": datetime.now()
    }
    db.applications.insert_one(new_app)
    return jsonify({"success": True, "message": "Application submitted successfully!"}), 200

# --- Mentorship System ---

@app.route('/api/mentorship/request', methods=['POST'])
def create_mentorship_request():
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False, "message": "Only students can request mentorship."}), 403
        
    data = request.get_json()
    new_req = {
        "student_id": ObjectId(current_user['id']),
        "student_name": current_user['name'],
        "alumni_id": ObjectId(data.get('alumni_id')),
        "department": data.get('department'),
        "year": data.get('year'),
        "skills": data.get('skills'),
        "goal": data.get('goal'),
        "preferred_duration": data.get('preferred_duration'),
        "status": "pending",
        "created_at": datetime.now()
    }
    db.mentorship_requests.insert_one(new_req)
    return jsonify({"success": True, "message": "Mentorship request sent successfully."}), 201

@app.route('/api/mentorship/requests', methods=['GET'])
def get_mentorship_requests():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False, "message": "Unauthorized"}), 403
        
    reqs = list(db.mentorship_requests.find({"alumni_id": ObjectId(current_user['id']), "status": "pending"}).sort("created_at", -1))
    return jsonify({"requests": [doc_to_dict(req) for req in reqs], "success": True}), 200

@app.route('/api/connections/request', methods=['POST'])
def connections_request():
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False, "message": "Only students can request connection"}), 403
    
    data = request.get_json()
    new_req = {
        "student_id": ObjectId(data['student_id']),
        "student_name": current_user['name'],
        "alumni_id": ObjectId(data['alumni_id']),
        "department": current_user.get('department', 'N/A'),
        "year": current_user.get('year', 'N/A'),
        "skills": current_user.get('skills', ''),
        "goal": "I would like to connect and learn more.",
        "preferred_duration": "Flexible",
        "status": "pending",
        "created_at": datetime.now()
    }
    db.mentorship_requests.insert_one(new_req)
    return jsonify({"success": True, "message": "Request sent."}), 201

@app.route('/api/mentorship/request/<req_id>/respond', methods=['POST'])
def respond_mentorship_request(req_id):
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False}), 403
        
    data = request.get_json()
    status = data.get('status')
    
    req = db.mentorship_requests.find_one({"_id": ObjectId(req_id), "alumni_id": ObjectId(current_user['id'])})
    if not req:
        return jsonify({"success": False, "message": "Request not found."}), 404
        
    db.mentorship_requests.update_one({"_id": ObjectId(req_id)}, {"$set": {"status": status}})
    
    if status == 'accepted':
        db.mentorship_connections.insert_one({
            "student_id": req['student_id'],
            "student_name": req['student_name'],
            "alumni_id": req['alumni_id'],
            "alumni_name": current_user['name'],
            "status": "accepted",
            "created_at": datetime.now()
        })
        
    return jsonify({"success": True, "message": f"Request {status}."}), 200

@app.route('/api/mentorship/connections', methods=['GET'])
def get_mentorship_connections():
    global current_user
    if not current_user:
        return jsonify({"success": False}), 403
        
    query = {"alumni_id": ObjectId(current_user['id'])} if current_user['type'] == 'alumni' else {"student_id": ObjectId(current_user['id'])}
    conns = list(db.mentorship_connections.find(query).sort("created_at", -1))
    return jsonify({"connections": [doc_to_dict(c) for c in conns], "success": True}), 200

@app.route('/api/dashboard/recent-activity', methods=['GET'])
def dashboard_recent_activity():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Unauthorized", "success": False}), 403

    alumni_id = ObjectId(current_user['id'])
    activities = []

    # New mentorship requests
    mentorship_requests = list(db.mentorship_requests.find({"alumni_id": alumni_id}).sort("created_at", -1).limit(10))
    for req in mentorship_requests:
        student_name = req.get('student_name', 'A student')
        created_at = req.get('created_at', datetime.now())
        activities.append({
            'type': 'mentorship_request',
            'message': f"{student_name} requested mentorship",
            'time': format_time_ago(created_at),
            'created_at': created_at
        })

    # Task completed by students
    completed_tasks = list(db.tasks.find({"alumni_id": alumni_id, "status": "completed"}).sort("created_at", -1).limit(10))
    for task in completed_tasks:
        student_name = task.get('student_name', 'A student')
        task_title = task.get('task_title', 'a task')
        created_at = task.get('completed_at') or task.get('created_at') or datetime.now()
        activities.append({
            'type': 'task_completed',
            'message': f"{student_name} completed {task_title}",
            'time': format_time_ago(created_at),
            'created_at': created_at
        })

    # New mentorship connections
    mentorship_connections = list(db.mentorship_connections.find({"alumni_id": alumni_id}).sort("created_at", -1).limit(10))
    for conn in mentorship_connections:
        student_name = conn.get('student_name', 'A mentee')
        created_at = conn.get('created_at', datetime.now())
        activities.append({
            'type': 'mentorship_connection',
            'message': f"{student_name} joined your mentorship", 
            'time': format_time_ago(created_at),
            'created_at': created_at
        })

    # Optional: New job applications
    try:
        job_applications = list(db.applications.find({"alumni_id": alumni_id}).sort("applied_at", -1).limit(10))
    except Exception:
        job_applications = []

    for app in job_applications:
        student_name = app.get('student_name', 'A student')
        created_at = app.get('applied_at', datetime.now())
        activities.append({
            'type': 'job_application',
            'message': f"{student_name} applied to your job",
            'time': format_time_ago(created_at),
            'created_at': created_at
        })

    # Sort and limit results
    activities = sorted(activities, key=lambda x: x['created_at'], reverse=True)[:5]
    # Remove created_at before returning
    recent_activities = [{k: v for k, v in act.items() if k != 'created_at'} for act in activities]

    return jsonify({"recent_activity": recent_activities, "success": True}), 200


@app.route('/api/dashboard/upcoming-sessions', methods=['GET'])
def dashboard_upcoming_sessions():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Unauthorized", "success": False}), 403

    alumni_id = ObjectId(current_user['id'])
    now = datetime.now()
    slots = list(mentorship_slots_collection.find({
        "alumni_id": alumni_id,
        "is_booked": True,
        "start_time": {"$gt": now}
    }).sort("start_time", 1))

    upcoming = []
    for slot in slots:
        start = slot.get('start_time')
        if not isinstance(start, datetime):
            continue
        upcoming.append({
            'student_name': slot.get('student_name', 'Booked Student'),
            'date': start.strftime('%Y-%m-%d'),
            'time': start.strftime('%I:%M %p').lstrip('0'),
            'meeting_link': slot.get('meeting_link', '')
        })

    return jsonify({"upcoming_sessions": upcoming, "success": True}), 200


@app.route('/api/mentorship/task', methods=['POST'])
def assign_task():
    global current_user
    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"success": False}), 403
        
    data = request.get_json()
    new_task = {
        "connection_id": data.get('connection_id'),
        "alumni_id": ObjectId(current_user['id']),
        "task_title": data.get('task_title'),
        "description": data.get('description'),
        "deadline": data.get('deadline'),
        "priority": data.get('priority'),
        "status": "pending",
        "created_at": datetime.now()
    }
    db.tasks.insert_one(new_task)
    return jsonify({"success": True, "message": "Task assigned."}), 201

@app.route('/api/mentorship/tasks', methods=['GET'])
def get_tasks():
    connection_id = request.args.get('connection_id')
    tasks = list(db.tasks.find({"connection_id": connection_id}).sort("created_at", -1))
    return jsonify({"tasks": [doc_to_dict(t) for t in tasks], "success": True}), 200

@app.route('/api/mentorship/task/<task_id>/complete', methods=['POST'])
def complete_task(task_id):
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False}), 403
        
    data = request.get_json()
    db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {
            "status": "completed", 
            "completion_notes": data.get('completion_notes'),
            "submission_link": data.get('submission_link'),
            "completed_at": datetime.now()
        }}
    )
    return jsonify({"success": True, "message": "Task marked complete."}), 200

@app.route('/api/mentorship/progress', methods=['POST'])
def submit_progress():
    global current_user
    if not current_user or current_user['type'] != 'student':
        return jsonify({"success": False}), 403
        
    data = request.get_json()
    new_prog = {
        "connection_id": data.get('connection_id'),
        "student_id": ObjectId(current_user['id']),
        "task_id": data.get('task_id'),
        "progress_text": data.get('progress_text'),
        "date": data.get('date', datetime.now().strftime('%Y-%m-%d')),
        "created_at": datetime.now()
    }
    db.progress_updates.insert_one(new_prog)
    return jsonify({"success": True, "message": "Progress submitted."}), 201

@app.route('/api/mentorship/progress', methods=['GET'])
def get_progress():
    connection_id = request.args.get('connection_id')
    logs = list(db.progress_updates.find({"connection_id": connection_id}).sort("created_at", -1))
    return jsonify({"progress": [doc_to_dict(l) for l in logs], "success": True}), 200

# --- Chat Routes ---

@app.route('/api/chat/send', methods=['POST'])
def send_message():
    global current_user
    try:
        data = request.get_json()
        sender_id = data.get('sender_id') or (current_user['id'] if current_user else None)
        if not sender_id:
            return jsonify({"success": False, "message": "Unauthorized"}), 401

        connection_id = data.get('connection_id')
        receiver_id = data.get('receiver_id')
        message = data.get('message')

        if not connection_id or not receiver_id or not message:
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        # Check if connection exists and is accepted
        connection = mentorship_connections_collection.find_one({
            "_id": ObjectId(connection_id),
            "$or": [
                {"student_id": ObjectId(sender_id), "alumni_id": ObjectId(receiver_id)},
                {"alumni_id": ObjectId(sender_id), "student_id": ObjectId(receiver_id)}
            ],
            "status": "accepted"
        })

        if not connection:
            return jsonify({"success": False, "message": "Invalid connection or not authorized"}), 403

        # Insert message
        message_doc = {
            "connection_id": ObjectId(connection_id),
            "sender_id": ObjectId(sender_id),
            "receiver_id": ObjectId(receiver_id),
            "message": message,
            "timestamp": datetime.now(),
            "is_read": False
        }

        result = messages_collection.insert_one(message_doc)
        return jsonify({"success": True, "message": "Message sent", "message_id": str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/chat/messages/<connection_id>', methods=['GET'])
def get_messages(connection_id):
    global current_user
    req_user = request.args.get('user_id') or (current_user['id'] if current_user else None)
    if not req_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    try:
        # Validate connection_id format
        if not connection_id or not all(c in '0123456789abcdef' for c in connection_id.lower()):
            return jsonify({"success": False, "message": "Invalid connection ID format"}), 400

        # Check if user is part of the connection
        connection = mentorship_connections_collection.find_one({
            "_id": ObjectId(connection_id),
            "$or": [
                {"student_id": ObjectId(req_user)},
                {"alumni_id": ObjectId(req_user)}
            ],
            "status": "accepted"
        })

        if not connection:
            return jsonify({"success": False, "message": "Invalid connection or not authorized"}), 403

        messages = list(messages_collection.find({"connection_id": ObjectId(connection_id)}).sort("timestamp", 1))
        messages_list = []
        for msg in messages:
            messages_list.append({
                "sender_id": str(msg['sender_id']),
                "message": msg['message'],
                "timestamp": msg['timestamp'].isoformat() if isinstance(msg['timestamp'], datetime) else msg['timestamp']
            })

        return jsonify({"messages": messages_list, "success": True}), 200
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

@app.route('/api/chat/conversations', methods=['GET'])
def get_conversations():
    global current_user
    req_user = request.args.get('user_id') or (current_user['id'] if current_user else None)
    if not req_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = ObjectId(req_user)
    connections = list(mentorship_connections_collection.find({
        "$or": [
            {"student_id": user_id},
            {"alumni_id": user_id}
        ],
        "status": "accepted"
    }))

    conversations = []
    for conn in connections:
        other_user_id = conn['alumni_id'] if conn['student_id'] == user_id else conn['student_id']
        other_user = users_collection.find_one({"_id": other_user_id})
        if other_user:
            # Get last message
            last_msg = messages_collection.find_one(
                {"connection_id": conn['_id']},
                sort=[("timestamp", -1)]
            )
            last_message = last_msg['message'] if last_msg else "No messages yet"
            conversations.append({
                "connection_id": str(conn['_id']),
                "other_user": doc_to_dict(other_user),
                "last_message": last_message
            })

    return jsonify({"conversations": conversations, "success": True}), 200

@app.route('/api/chat/connections', methods=['GET'])
def get_chat_connections():
    global current_user
    req_user = request.args.get('user_id') or (current_user['id'] if current_user else None)
    if not req_user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = ObjectId(req_user)
    connections = list(mentorship_connections_collection.find({
        "$or": [
            {"student_id": user_id},
            {"alumni_id": user_id}
        ],
        "status": "accepted"
    }))

    chat_connections = []
    for conn in connections:
        other_user_id = conn['alumni_id'] if conn['student_id'] == user_id else conn['student_id']
        other_user = users_collection.find_one({"_id": other_user_id})
        if other_user:
            chat_connections.append({
                "connection_id": str(conn['_id']),
                "user_id": str(other_user_id),
                "name": other_user['name'],
                "role": other_user['type'],
                "profile_image": other_user.get('profile_image')
            })

    return jsonify({"connections": chat_connections, "success": True}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)