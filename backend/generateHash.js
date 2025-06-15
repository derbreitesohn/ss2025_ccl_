const bcrypt = require('bcrypt');

const password = 'Emma';

bcrypt.hash(password, 10).then(hash => {
    console.log("Hashed password:", hash);
});
