const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/fitworkouts')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const testuser = {
    username: 'testuser',
    email: 'user@testmail.com',
    password: 'testuser'
}

const admin = {
    username: 'admin',
    email: 'admin@adminmail.com',
    password: 'admin123'
}

const users = [testuser, admin]
const seedUsers = async () => {
    /* delete existing data */
    await User.deleteMany({});
    for(let i=0; i<2; i++){
        const { username, email, password } = users[i];
        const user = new User({username, email});
        const registerUser = await User.register(user, password);
    };

};

seedUsers().then(() => {
    mongoose.connection.close();
});