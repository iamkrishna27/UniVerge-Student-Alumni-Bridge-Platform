# 🎓 UniVerge – Student Alumni Bridge Platform

UniVerge is a **full-stack web platform** that connects **students and alumni** for mentorship, networking, and career guidance.
The platform integrates **modern backend technologies, dual databases, blockchain**, and **machine learning** to create a secure and intelligent academic networking system.

---

## 📋 Overview

UniVerge bridges the gap between students and alumni by enabling:

- Mentor–mentee connections
- Career guidance and professional networking
- Secure credential verification using blockchain
- Smart matching powered by machine learning

Built as a **hackathon-ready, scalable full-stack application**.

---

## ✨ Key Features

- ✅ Student & Alumni registration and profile management
- ✅ Smart mentor–student matching using ML
- ✅ Real-time messaging system
- ✅ Community forum for discussions
- ✅ Blockchain-based credential storage & verification
- ✅ Analytics-ready backend architecture

---

## 🛠️ Tech Stack

### Backend
- Flask 2.3.3
- Python 3.8+

### Databases
- PostgreSQL – User data & profiles
- MongoDB – Chat & messaging data

### Blockchain
- Web3.py
- IPFS – Credential verification

### ML / AI
- Scikit-learn – Intelligent user matching

### Frontend
- HTML
- CSS
- JavaScript

---

## 📁 Project Structure

UniVerge/
├── app.py               # Main Flask application
├── requirements.txt     # Project dependencies
├── static/              # CSS, JavaScript, images
├── templates/           # HTML templates
├── models/              # Database models
└── services/            # Business logic & services

---

## 🚀 Quick Setup

### 1️⃣ Installation

git clone https://github.com/iamkrishna27/UniVerge-mackathon1.0.git
cd UniVerge-mackathon1.0
pip install -r requirements.txt

---

### 2️⃣ Database Setup

PostgreSQL:
CREATE DATABASE univerge_db;

MongoDB:
mongod --dbpath ./data

---

### 3️⃣ Run the Application

python app.py

Access the application at:
http://localhost:5000

---

## 🌐 Environment Variables (.env)

DATABASE_URL=postgresql://user:password@localhost/univerge_db
MONGO_URI=mongodb://localhost:27017/univerge_chat
SECRET_KEY=your-secret-key
BLOCKCHAIN_RPC_URL=https://your.rpc.node

---

## 📊 API Endpoints

POST /auth/register – User registration
POST /auth/login – User login
GET /api/alumni – Fetch alumni list
POST /chat/send – Send chat message
GET /forum/posts – Retrieve forum posts

---

## 🎯 Hackathon Submission

This project demonstrates:

- Full-stack development skills
- Dual-database architecture (SQL + NoSQL)
- Blockchain integration for secure credentials
- Machine learning for smart matching
- Scalable backend design

---

## 📞 Contact & Links

GitHub:
https://github.com/iamkrishna27/UniVerge-mackathon1.0

Hackathon:
UniVerge Mackathon 1.0 Submission
