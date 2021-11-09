var crypto = require('crypto');

const secret = crypto.createHash('sha256').update('secret$12345678').digest('hex');
console.log(secret);
