const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const cert = fs.readFileSync('api.cert');

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api', verifyToken, (req, res) => {
    jwt.verify(req.token, cert, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created.',
                authData
            }); 
        }
    });
});

app.post('/api/login', (req, res) => { 
    // Mock user
    const user = {
        id: 1,
        username: 'admin',
        email: 'admin@email.com'
    };

    jwt.sign({user}, cert, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(8081, () => console.log('Server started on port 8081'));