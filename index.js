const express = require('express');
const mongoose = require('mongoose');
const app = express();

// model
const models = require('./models');
const MemberModel = require('./models/user-model');
const CourseModel = require('./models/course-model');

require('dotenv').config();

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
// or use body-parser instead?

app.listen('8080', () => {
  console.log('running on port of 8080');
});

app.get('/', async (req, res) => {
  res.send('hello !');
});

// 隨機設定member的function
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
      email:'jhh@gmail.com',
      role:'student'
    });
    password++;
    let newSave = await newMember.save();

    // post Course
    const  newCourse = new CourseModel({
      id:'123',
      title:'HTML5',
      description:'someText',
      price:100
    })
    let courseSave = await newCourse.save();


    console.log(courseSave) 
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
