require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/fitworkouts'

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('MongoDB connected!!')
        await seedUsers().then(() => {
            mongoose.connection.close();
        });
    }catch (err) {
        console.log('Failed to connect to MongoDB', err)
      }
}
connectDB()



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

