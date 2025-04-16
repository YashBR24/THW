const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile_no: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String },
    aadhar_card : {type: String},
    pan_card : {type: String},
    account_no: { type: String},
    ifsc_code : {type: String},
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    role:{type:String,default:'User'},
    join_date:{type :Date, default:Date.now},
    photo: {type: String},
    active: { type: Boolean, default: true },
    user_edit: { type: Boolean, default: false },
    user_view: { type: Boolean, default: false },
    dashboard_edit: { type: Boolean, default: false },
    dashboard_view: { type: Boolean, default: false },
    camera_edit: { type: Boolean, default: false },
    camera_view: { type: Boolean, default: false },
    employee_edit: { type: Boolean, default: false },
    employee_view: { type: Boolean, default: false },
    food_edit: { type: Boolean, default: false },
    food_view: { type: Boolean, default: false },
    inventory_edit: { type: Boolean, default: false },
    inventory_view: { type: Boolean, default: false },
    ticket_edit: { type: Boolean, default: false },
    ticket_view: { type: Boolean, default: false },
    ticket_update:{ type: Boolean, default: false},
    plans_edit: { type: Boolean, default: false },
    plans_view: { type: Boolean, default: false },
    accounts_edit: { type: Boolean, default: false },
    accounts_view: { type: Boolean, default: false },
    locker_edit: { type: Boolean, default: false },
    locker_view: { type: Boolean, default: false },
    locker_scan: { type: Boolean, default: false },
    ticket_scan: { type: Boolean, default: false },
    food_scan: { type: Boolean, default: false },
    deposit_scan: { type: Boolean, default: false },
    delete:{type:Boolean,default:false},
    pin:{type:String}
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.pre('save', async function(next) {
    if (!this.isModified('pin')) return next();
    this.pin = await bcrypt.hash(this.pin, 10);
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;