const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ИСПРАВЛЕНИЕ: Получаем экспорт по умолчанию (.default)
const connectDB = require('../lib/connectDb').default; 

// Если ваши модели (User) тоже используют export default, их тоже нужно исправить:
const User = require('../models/User').default; 

const DEMO_EMAIL = "demo@admin.com";
const DEMO_PASSWORD = "password123";

async function seedUser() {
    try{
        await connectDB();
        const existingUser = await User.findOne({ email: DEMO_EMAIL });
        if (existingUser) {
            console.log("Demo user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

        const newUser = new User({
            name: "Demo Admin",
            email: DEMO_EMAIL,
            password: hashedPassword,
        });

        await newUser.save();
        console.log("Demo user created successfully");
    } catch (error) {
        console.error("Error seeding demo user:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedUser();