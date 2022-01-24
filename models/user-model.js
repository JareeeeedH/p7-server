const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const loginValidation = require('../validation').loginValidation;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 24,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == 'student';
};

userSchema.methods.isInstructor = function () {
  return this.role == 'instructor';
};

// mongoose middleWare
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    console.log(this);
    next();
  } else {
    return next();
  }
});

/**
 *
 * @param {*} password 需要驗證時, 傳入輸入的密碼
 * @param {*} cb compare驗證完畢後, 獲得結果, 再把結果丟給這個callBack做對應的事情
 *                請參考auth/login使用, 第二個參數定義callBack做什麼事情
 */
userSchema.methods.comparePassword = function (password, cb) {
  // (err, isMatch)=>{ ... }是compare驗證結果
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

const member = mongoose.model('Member', userSchema);
module.exports = member;
