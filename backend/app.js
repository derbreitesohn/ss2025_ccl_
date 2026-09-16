const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
//app.use(cors({
   // credentials: true
//}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./services/database.js')
const path = require("path")
app.use(express.static("public"))

app.get('/api', (req, res) => res.send('Hello World'))

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const petsRouter = require("./routes/pets");
const listingsRouter = require("./routes/listings");
const favoriteRouter = require("./routes/favorites");
const messagesRouter = require("./routes/messages");

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/favorites", favoriteRouter);
app.use('/api/messages', messagesRouter);

// An unknown API route should never return the frontend HTML.
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

// Serve React static build
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Fallback to index.html for SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const onlineUsers = new Map();
const { saveMessage } = require('./models/messageModel');

io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
    });

    socket.on('private_message', async ({ senderId, receiverId, content }) => {
        await saveMessage(senderId, receiverId, content);
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('private_message', {
                senderId, content, timestamp: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
        }
    });
});

function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
}
app.use(errorHandler);

// On Vercel the app is imported by a serverless function, which owns the request
// lifecycle - binding a port there would fail the build. Locally nothing changes:
// `npm start` still runs this file directly and still listens.
if (!process.env.VERCEL) {
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
