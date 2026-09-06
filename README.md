<div align="center">

# 🚀 UniVerge

### Alumni–Student Mentorship & Opportunity Platform

Connecting students with alumni for guidance, mentorship, job opportunities, and skill development — all in one place.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://univerge.onrender.com/)
![Status](https://img.shields.io/badge/status-active%20development-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-frontend-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-logic-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
[![License: TBD](https://img.shields.io/badge/license-TBD-lightgrey?style=for-the-badge)](#-license)

🌐 [Live Demo](https://univerge.onrender.com/) · 📖 [Documentation](#-table-of-contents) · 🐛 [Report Bug](../../issues)

</div>

---

## 📚 Table of Contents

- [About](#-about)
- [Features](#-features)
  - [Student Features](#student-features)
  - [Alumni Features](#alumni-features)
  - [Public Profiles](#-public-profile-feature-linkedin-style)
  - [Chat System](#-chat-system)
  - [Mentorship System](#-mentorship-system)
  - [Job Board](#-job-board)
  - [Stories Feature](#-stories-feature)
  - [Dashboards](#-dashboard-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [License](#-license)
- [Status](#-status)

---

## 📖 About

**UniVerge** is a mentorship and networking platform designed to connect students with alumni for guidance, job opportunities, and skill development. The platform enables structured mentorship, one-to-one chat, task tracking, job postings, and professional profile discovery — bringing LinkedIn-style networking together with a focused mentorship workflow.

---

## ✨ Features

### Student Features

| Feature | Description |
|---|---|
| 🧑‍🏫 Alumni Directory | View and browse all available alumni |
| 🤝 Mentorship Requests | Send mentorship requests to alumni |
| 👥 Connected Mentors | View all currently connected mentors |
| 📋 Mentorship Hub | Manage multiple mentors with scroll support |
| 💬 One-to-One Chat | Chat directly with connected alumni |
| ✅ Task Updates | Submit updates on assigned tasks |
| 📌 Assigned Tasks | View tasks assigned by mentors |
| 📰 Alumni Stories | Read shared alumni experiences |
| 💼 Job Board | Access job opportunities posted by alumni |
| 🧭 Confidence & Resources | Access supporting resource sections |
| 🔗 Clickable Profiles | View LinkedIn-style alumni profiles |

### Alumni Features

| Feature | Description |
|---|---|
| 📥 Student Requests | View incoming mentorship requests |
| ✅ Accept / Reject | Approve or decline mentorship requests |
| 📝 Task Assignment | Assign tasks to mentees |
| 📊 Progress Tracking | Track mentee progress over time |
| 💬 One-to-One Chat | Chat directly with students |
| 📰 Post Stories | Share experiences with students |
| 💼 Post Jobs | Offer job opportunities via the Job Board |
| 👥 Assigned Mentees | View all currently assigned mentees |
| 🔗 Clickable Profiles | View LinkedIn-style student profiles |

### 🪪 Public Profile Feature (LinkedIn-Style)

Click any student or alumni name to view a detailed profile including:

- Profile photo
- Bio
- Skills
- Experience *(Alumni)*
- Career interests *(Student)*
- LinkedIn / GitHub links
- Connect / Message buttons

### 💬 Chat System

- One-to-one chat
- Auto-loads connected users
- "Message" button redirect
- Real-time conversation interface

### 🤝 Mentorship System

- Student sends a mentorship request
- Alumni accepts or rejects the request
- Multiple mentors supported per student
- Scrollable mentor list
- Task assignment
- Daily progress tracking

### 💼 Job Board

- Alumni post job opportunities
- Students view available opportunities
- Centralized job listings

### 📰 Stories Feature

- Alumni share their experience
- Students learn from shared stories
- Weekly story highlight *(planned)*

### 📊 Dashboard Features

<table>
<tr>
<td valign="top" width="50%">

**Student Dashboard**
- My Mentors
- Assigned Tasks
- Recent Updates
- Stories Feed

</td>
<td valign="top" width="50%">

**Alumni Dashboard**
- Assigned Mentees
- Task Tracker
- Recent Activity
- Message & Assign Task buttons

</td>
</tr>
</table>

### 🪪 Profile Management

- Upload profile photo
- Edit profile information
- Professional bio
- Skills section
- LinkedIn / GitHub links
- Clickable public profiles

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Python (Flask) |
| **Database** | MongoDB |

---

## 📁 Project Structure

```
UniVerge/
├── app.py                 # Backend Flask server
├── templates/
│   └── index.html         # Frontend UI
└── static/
    ├── script.js           # Frontend logic
    └── styles.css          # UI styling
```

---

## 📦 Installation

> [ADD/CONFIRM EXACT SETUP STEPS — the following is a standard Flask setup based on the project structure above]

```bash
# Clone the repository
git clone https://github.com/[ADD-YOUR-USERNAME]/UniVerge.git
cd UniVerge

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt   # [ADD requirements.txt IF NOT ALREADY PRESENT]

# Run the Flask app
python app.py
```

### ⚙️ Configuration

[ADD YOUR ENVIRONMENT VARIABLES HERE, e.g. MongoDB connection string]

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `[ADD_VARIABLE]` | — | [ADD DESCRIPTION] |

---

## 💻 Usage

1. Sign up as a **Student** or **Alumni**
2. Log in to access your role-based dashboard
3. Students can browse the alumni directory and send mentorship requests
4. Alumni can accept requests, assign tasks, and post job opportunities
5. Use the chat system to communicate one-to-one once connected

🌐 Try it live: **[univerge.onrender.com](https://univerge.onrender.com/)**

---

## 🗺️ Roadmap

**In Progress**
- [ ] Leaderboard (Most Active Alumni)
- [ ] Story of the Week
- [ ] Achievements System
- [ ] Notification System
- [ ] Sidebar Navigation

**Future Enhancements**
- [ ] Leaderboard
- [ ] Notification System
- [ ] Video Call Mentorship
- [ ] Resume Review Section
- [ ] Event System
- [ ] Alumni Hiring Dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---

## 👤 Contributors

- **Krishna**

---

## 📄 License

[ADD YOUR LICENSE HERE — e.g. MIT, Apache 2.0]

---

## 📌 Status

**Project Status:** In Active Development
**Current Phase:** Feature Expansion & UI Enhancement
