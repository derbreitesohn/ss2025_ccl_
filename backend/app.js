const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./services/database.js')
const path = require("path")
app.use(express.static("public"))

app.get('/', (req, res) => res.send('Hello World'))

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const petsRouter = require("./routes/pets");
const listingsRouter = require("./routes/listings");
const favoriteRouter = require("./routes/favorites");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/listings", listingsRouter);
app.use("/favorites", favoriteRouter);

function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
