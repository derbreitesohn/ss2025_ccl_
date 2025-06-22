## Technical & Project Documentation

### Hosting Setup

🌐 **Live Website**: [https://cc241045-10757.node.fhstp.cc](https://cc241045-10757.node.fhstp.cc)  
📁 **GitLab Repository**: [https://git.nwt.fhstp.ac.at/cc241045/ss2025_ccl_cc241045](https://git.nwt.fhstp.ac.at/cc241045/ss2025_ccl_cc241045)
### 🧰 Technologies Used

- **Frontend**: React, JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Hosting**: FH St. Pölten Campus Cloud
- **Other Tools**: Axios, React Router, and more
- **Deployed via:** Filezilla and the FH Campus Cloud

### Project Architecture

/backend  
├── controllers/  — Handles the logic for processing requests  
├── models/       — Contains data models, like database schemas  
├── routes/       — Defines API endpoints  
└── services/     — Provides authentication and database-related services

/frontend  
├── components/   — Contains all the different pages  
└── images/       — Stores logos and login/signup images


### User Interaction Overview

- What problem does your solution solve? What is it's main purpose?
  - PatPat is a full-stack web application that connects pet owners for fun playdates and provides a platform for putting animals up for adoption.
- What features should I test?
  - Test the Filter system, Favorites, Messages, CRUD
- What is the main flow?
    - Login -> Profile -> Home browse -> Favorite a listing -> Click "View Listing" -> Click "Contact" to start messaging
- Any design decisions you want to highlight?
  - Used separate pets and listings table so you can create a listing based on an already existing pet.
- Any known issues or limitations?
  - image upload only via url
  - not mobile responsive