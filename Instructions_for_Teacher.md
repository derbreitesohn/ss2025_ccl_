**Setup Instructions**

### 1. Clone the repository
```bash
git clone https://git.nwt.fhstp.ac.at/cc241045/ss2025_ccl_cc241045.git
cd ss2025_ccl_cc241045
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

### Credentials

#### Database credentials
  - Host: Flo Madner
  - username: cc241045
  - password: Lz6@Xl3+Hh6!

- User Logins
  - johndoe123 , SecureP@ssw0rd
  - bobby , bob

### User Flow for Grading

1. Login via the user credentials given
2. Once logged in you land on the Profile Page from here you can see your profile but also your pets. 
3. If you would like you can edit your profile, edit your pets or create a new pet
4. Go to "Home", here you can browse all listings, you can also filter by dog, cat, playdate or adoption
5. If you click the heart on a listing card the listing gets saved to your "Favorites" page.
6. If you click "View details" you get to the Listing Details Page where you can see more details of the pet. 
7. From here (but also from home) you can click the "Contact" button which immediately sends you to the Messages page and loads a chat with the owner of the pet. On the left side you can also see your recent chats.


- Which features are essential to test?
  - Favorites, Messages, Filter system, creating
- Any specific edge cases or sequences?
  - When creating a new listing you can choose to either create from an existing pet or create a new listing from scratch
