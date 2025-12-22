// Script to make the first user an admin
require('dotenv').config();
const mongoose = require('mongoose');

const db = process.env.MONGO_URI || 'mongodb://localhost:27017/nex';

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function makeAdmin() {
    try {
        await mongoose.connect(db);
        console.log('Connected to MongoDB');

        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} user(s):`);

        users.forEach(u => {
            console.log(`  - ${u.username} (${u.email}) - Role: ${u.role}`);
        });

        if (users.length === 0) {
            console.log('No users found!');
            process.exit(1);
        }

        // Make the first user an admin
        const firstUser = users[0];

        if (firstUser.role === 'admin') {
            console.log(`\n${firstUser.username} is already an admin!`);
        } else {
            firstUser.role = 'admin';
            await firstUser.save();
            console.log(`\n✅ Made ${firstUser.username} an admin!`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

makeAdmin();
