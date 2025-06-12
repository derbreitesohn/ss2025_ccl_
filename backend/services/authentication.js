const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For hashing and checking passwords
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // Secret key for signing JWTs

async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash); //extracts salt from hash, reapplies to pw, hashes same way, checks if result match
    return pw;
}

// Authenticates user, checking credentials, setting JWT if valid
async function authenticateUser({username, password}, users, res) { //{} for destructuring, cleaner
    const user = users.find( u => {
        return u.username === username;
    });

    // If user exists and pw correct
    if (user && await checkPassword(password, user.password)) {
        // Create token
        const accessToken = jwt.sign({ id: user.id, name: user.name }, ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        // Store token as cookie in browser
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000
        });

        res.json({Login: "success"});
    } else {
        res.json({Login: "Fail"});
    }
}

// check if valid JWT in cookies
function authenticateJWT(req, res, next) {
    console.log("Inside authenticateJWT");
    console.log("req.cookies:", req.cookies);

    // Extract token from 'accessToken' cookie
    const token = req.cookies && req.cookies['accessToken'];

    if (token) {
        // Verify token using the secret
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log(user)
            req.user = user;  // Attach decoded user info to req obj
            next();  // Proceed
        });
    } else {
        res.sendStatus(401);
    }
}


module.exports = {
    authenticateUser,
    authenticateJWT,
}