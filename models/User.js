const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Lütfen E-Mail Girin"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Lütfen Geçerli Bir Email Girin"]
    },
    password: {
        type: String,
        required: [true, "Lütfen Şifre Girin"],
        minlength: [6, "Şifre En Az 6 Karakterden Oluşmalı "],
    },
});


//fire a function before doc save to db
userSchema.pre('save', async function( next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    // static methodların içinde this kelimesi userModelin kendisini temsil eder
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Şifre Yanlış")
    }
    throw Error("Bu Email Mevcut Değil")
}

const User = mongoose.model("user", userSchema);

module.exports = User;
