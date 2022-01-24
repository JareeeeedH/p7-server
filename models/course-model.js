const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // pending !!!
  // 當註冊了課程, 課程會綁上user的資料, 就可以獲取使用
  instructor: {

    // 綁上註冊者的id
    type: mongoose.Schema.Types.ObjectId,
    // 與MemberModel綁定, 可以使用於populate
    ref: 'Member',
  },
  studends: {
    type: [String],
    default: [],
  },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
