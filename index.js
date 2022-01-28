const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors')

// routers
const authRouter = require('./routes').authRouter;
const courseRouter = require('./routes').courseRouter;

// model
const models = require('./models');
const MemberModel = require('./models/user-model');
const CourseModel = require('./models/course-model');

require('dotenv').config();

// passport與 passport-jwt設定
const passport = require('passport');
require('./config/passport')(passport);

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log('mongoDB is connected !');
  })
  .catch((err) => {
    console.log('error to connect !');
  });

//   middleWare for what ?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors())


// or use body-parser instead?
app.use('/api/user', authRouter);

// course Route
// 這邊需要passport認證保護 -> 才可以進入 courseRouter
app.use(
  '/api/courses',
  passport.authenticate('jwt', { session: false }),
  courseRouter
);

app.listen('8080', () => {
  console.log('running on port of 8080');
});

app.get('/', async (req, res) => {
  res.send('hello !');
});

// 以下隨機設定member的function
let password = '111111';

const setUserTest = async (req, res) => {
  let randomNum = Math.round(Math.random() * 10);
  let nameList = [
    'jared',
    'eric',
    'Neil',
    'joe',
    'leo',
    'Amy',
    'Jerry',
    'Wang',
    'Wanye',
  ];

  try {
    // post User
    let newMember = new MemberModel({
      name: nameList[randomNum],
      password,
      email: 'jhh@gmail.com',
      role: 'student',
    });
    password++;
    let newSave = await newMember.save();

    // post Course
    const newCourse = new CourseModel({
      id: '123',
      title: 'HTML5',
      description: 'someText',
      price: 100,
    });
    let courseSave = await newCourse.save();

    console.log(courseSave);
    res.send(newSave);
  } catch (e) {
    res.send(e);
  }
};

app.get('/post', async (req, res) => {
  setUserTest(req, res);
});

// MemberModel.deleteMany({}).then((res) => {
//   console.log(res);
// });

// MemberModel.findOne({}, function (error, users) {
//   console.log(users);
// });


// // 刪除課程
// CourseModel.deleteMany({}).then((courses)=>{
//   console.log(courses)
// })