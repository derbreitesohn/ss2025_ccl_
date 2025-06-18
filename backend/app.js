const express = require('express');
const app = express();
const port = 3000;
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
const messagesRouter = require("./routes/messages");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/listings", listingsRouter);
app.use("/favorites", favoriteRouter);
app.use('/messages', messagesRouter);



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


// Replace app.listen with server.listen
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

