const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength:3,
    maxlength:24,
  },
  email: {
    type: String,
    required: true,
    minlength:6,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength:3,
    maxlength: 1024
  },
  role:{
    type:String,
    enum:['student', 'instructor'],
    required: true,
  },
  data:{
    type:Date,
    default:Date.now,
  },

});


userSchema.methods.isStudent = function(){
  return this.role === 'student'
}

userSchema.methods.isInstructor = function(){
  return this.role === 'instructor'
}

// mongoose middleWare
userSchema.pre("save",async function (next){
  if(this.isModified('password') || this.isNew){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    console.log(this)
    next();
  }
  else{
    return next();
  }
})

// ###解密的function, pending !
userSchema.methods.comparePassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, isMatch)=>{
    if(err){
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
}

const member = mongoose.model('Member', userSchema); 
module.exports = member;
