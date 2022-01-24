const router = require('express').Router();
const userModel = require('../models').userModel;

// Joi Validation
const registerValidation = require('../validation').registerValidation;
const loginValidation = require('../validation').loginValidation;

// JWT
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  console.log('user is comming !');
  next();
});

router.get('/testApi', (req, res) => {
  const messageObject = {
    message: 'test API is working',
  };
  return res.json(messageObject);
});

// 註冊
router.post('/register', async (req, res) => {
  console.log('register !!!');
  const validationResult = registerValidation(req.body);

  // 如果輸入經過joi驗證有錯誤
  const { error } = validationResult;
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { name, email, password, role } = req.body;

  const emailExist = await userModel.findOne({ email });

  //   email重複
  if (emailExist) {
    return res.status(401).send('email is usded !');
  }
  //   email 可註冊
  try {
    const newUserData = await new userModel({
      name,
      email,
      password,
      role,
    }).save();
    res.status(200).send({ message: 'OK', newUserData });
  } catch (e) {
    res.status(400).send({ message: 'failed to save data!' });
  }
});

// 登入
router.post('/login', async (req, res) => {
  const validationResult = loginValidation(req.body);
  const { error } = validationResult;
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  userModel.findOne({ email }, function (error, foundUser) {
    if (error) {
      return res.status(402).send(error);
    }

    foundUser.comparePassword(password, function (err, isMatch) {
      if (err) {
        return res.status(400).send(err);
      }
      if (isMatch) {
        console.log('foundUser',foundUser)
        const jwtObject = { _id: foundUser._id, email: foundUser.email };
        console.log('jwtObject--->', jwtObject)
        const token = jwt.sign(jwtObject, process.env.PASSPORT_SECRET);
        res
          .status(200)
          .send({ message: 'OK', token: 'JWT ' + token, foundUser });
      } else {
        console.log(err, 'password wrong!');
        res.status(401).send('wrong password');
      }
    });
  });
});

module.exports = router;
