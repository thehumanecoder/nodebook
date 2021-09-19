const crypto = require('crypto');



exports.setPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let salt = crypto.randomBytes(16).toString('hex');
            let hashed_password = crypto.pbkdf2Sync(password, salt,
                1000, 64, `sha512`).toString(`hex`);
            console.log('this>>>', this);

            resolve({
                password: hashed_password,
                salt: salt
            });
        } catch (e) {
            reject(e)
        }
    })
}

exports.checkPassword = (password, hashed_password, salt) => {
    return new Promise((resolve, reject) => {
        try {
            var hash = crypto.pbkdf2Sync(password,
                salt, 1000, 64, `sha512`).toString(`hex`);
            return hashed_password === hash;
        } catch (e) {
            reject(e)
        }
    })
}