const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
}

app.use(cors(corsOptions));

const db = require('./services/database.js')
const path = require("path")
app.use(express.static("public"))

app.get('/', (req, res) => res.send('Hello World'))




const cookieParser = require("cookie-parser")
app.use(cookieParser())

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const petsRouter = require("./routes/pets");
const listingsRouter = require("./routes/listings");
const favoriteRouter = require("./routes/favorites");

app.use("/",indexRouter);
app.use("/users",usersRouter);
app.use("/pets",petsRouter);
app.use("/listings",listingsRouter);
app.use("/favorites",favoriteRouter);

function errorHandler(err, req, res, next) {
    res.json( { error: err })
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
