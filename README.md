# SS2025_CCL_cc241045

# 🐾 PatPat

**PatPat** is a full-stack web application that connects pet owners for fun playdates and provides a platform for putting animals up for adoption. Whether you're looking to meet fellow pet lovers or help an animal find a new home, PatPat makes it easy to connect and care.

 **Live Website**: [https://cc241045-10757.node.fhstp.cc](https://cc241045-10757.node.fhstp.cc)  
  **New Domain**: [PatPat](https://patpat-three.vercel.app/)

## Preview the public home

Visitors can explore PatPat and listing details before creating an account. Login is available in the top-right corner, and account actions return you to your intended destination after signing in.

For a presentation preview with clearly labeled example pets and no database setup:

```bash
cd frontend
npm ci
npm run dev:demo -- --host 127.0.0.1 --port 5174
```

Open http://127.0.0.1:5174. See [frontend setup and checks](frontend/README.md) for the live backend configuration, browser tests, and preview details.

📁 **GitLab Repository**: [https://git.nwt.fhstp.ac.at/cc241045/ss2025_ccl_cc241045](https://git.nwt.fhstp.ac.at/cc241045/ss2025_ccl_cc241045)

## 🚀 Getting Started

This project consists of a **React frontend** and a **Node.js + Express backend**. It also uses **MySQL** for the Database.

### 1. Clone the repository
```bash
git clone https://github.com/derbreitesohn/ss2025_ccl_.git
cd ss2025_ccl_
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Start the backend server
```bash
cd ../backend
npm start
```

### 5. Start the frontend React app
```bash
cd ../frontend
npm run dev
```

## 🧰 Technologies Used

- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Hosting**: FH St. Pölten Campus Cloud
- **Other Tools**: Axios, React Router, and more

## 📖 Dev Diary

Daily development notes are documented in the `DevDiary.md` file.

## 🤝 Contributing

This project was developed for the Creative Code Lab 2025 in the Creative Computing program at FH St. Pölten.

## 👤 Author

- **Name**: Flo Madner
- **Student ID**: cc241045
- **Course**: Creative Computing – Creative Code Lab
- **University**: FH St. Pölten
