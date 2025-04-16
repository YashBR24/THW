const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/user'); // Ensure the path is correct

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function addUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/the_hill_waterfall', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        rl.question('Enter name: ', (name) => {
            rl.question('Enter mobile number: ', (mobile_no) => {
                rl.question('Enter email: ', (email) => {
                    rl.question('Enter date of birth (YYYY-MM-DD): ', (dob) => {
                        rl.question('Enter gender (male/female/other): ', (gender) => {
                            rl.question('Enter password: ', async (password) => {
                                const newUser = new User({
                                    name,
                                    mobile_no,
                                    email,
                                    date_of_birth: new Date(dob),
                                    gender,
                                    password,
                                    isVerified: true,
                                    role: 'User',
                                });

                                try {
                                    await newUser.save();
                                    console.log('User added successfully');
                                } catch (error) {
                                    console.error('Error adding user:', error);
                                } finally {
                                    mongoose.connection.close();
                                    rl.close();
                                }
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Database connection error:', error);
        mongoose.connection.close();
        rl.close();
    }
}

addUser();
