Recruitment System (Admin / Recruiter / Candidate)

Backend: Node.js (Express, MongoDB)
Frontend: React (Vite)

Getting Started
1) Backend
   - cd backend
   - Create .env (or edit existing):
     PORT=4000
     MONGO_URI=mongodb://127.0.0.1:27017/recruitment_system
     JWT_SECRET=change_me
   - Install & run: npm i && npm run dev

   Seed admin (optional):
   - npm run seed:admin
   - Default: admin@example.com / admin123

2) Frontend
   - cd frontend
   - npm i && npm run dev
   - App runs at http://localhost:5173

Roles & Features
- Admin: create recruiter/candidate accounts, see presence stats, assign candidates randomly to present recruiters
- Recruiter: toggle presence, set meeting link
- Candidate: upload resume, toggle presence, open assigned meeting link

API Endpoints
- POST /api/auth/login
- Admin: POST /api/admin/users, GET /api/admin/stats, POST /api/admin/assign-random
- Recruiter: POST /api/recruiter/presence, POST /api/recruiter/meeting-link, GET /api/recruiter/me
- Candidate: POST /api/candidate/resume, POST /api/candidate/presence, GET /api/candidate/meeting


