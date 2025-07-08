# ☎️ FSOpen Phonebook

A full-stack contact management app built as part of the [Full Stack Open](https://fullstackopen.com/en/) course by the University of Helsinki. It allows users to add, update, delete, and filter contacts in a phonebook using a React frontend and an Express backend.

---

## 📦 Features

- ➕ Add new contacts with name & phone number
- 🔄 Update existing contact numbers
- 🗑️ Delete contacts
- 🔍 Real-time filtering of contact list
- 📡 Full RESTful API integration
- ⚠️ Error handling and notifications
- 🌐 Deployed frontend and backend (optional)

---

## 🧱 Tech Stack

- **Frontend:** React, Axios, React Hooks
- **Backend:** Node.js, Express.js
- **Database (optional):** MongoDB with Mongoose
- **Styling:** CSS / Tailwind (optional)
- **Build tools:** Vite / Create React App (CRA)

---

## 📁 Project Structure

```bash
fsopen-phonebook/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── app.js
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── public/
├── .env.example
└── README.md

git clone https://github.com/devonochie/fsopen-phonebook.git
cd fsopen-phonebook
📡 Backend Setup
bash
Copy code
cd backend
npm install

cp .env.example .env

npm run dev

📝 Deployment (Optional)
bash
Copy code
# Build frontend for production
cd frontend
npm run build

# Serve frontend via backend
cp -r build ../backend/build

Then deploy to services like:

Render

Fly.io

Vercel + Railway (split)

📄 Acknowledgements
Built as part of the
📚 Full Stack Open 2025 course by the University of Helsinki
➡️ fullstackopen.com

👨‍💻 Author
Devon Onochie
GitHub: @devonochie


link to application - [https://full-stack-dwdd.onrender.com/](https://phone-book-gzt5.onrender.com/)
# fsopen-phonebook
