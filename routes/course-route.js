const router = require('express').Router();
const Course = require('../models').courseModel;
const courseValidation = require('../validation').courseValidation;

// middleWare
router.use((req, res, next) => {
  console.log('a request is comming to course route');
  next();
});

router.post('/', async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // passport認證過, 會有req.user可以使用
  // 註冊課程 
  console.log(req.user.isStudent(),'Student?' );
  console.log(req.user.isInstructor(), 'teacher?');
  console.log('req.User----->',req.user);

  if (req.user.isStudent()) {
    return res.status(400).send('student cant post new course');
  }

  let { title, description, price } = req.body;
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id //認證過的req.user的id綁定 
  });

  try {
    let newCorse = await newCourse.save();
    res.status(200).send('new course saved');
  } catch (err) {
    res.status(400).send('cant save course');
  }
});

// 所有課程
router.get('/', async (req, res)=>{

  console.log('get Courses')

  try{
      // courseModel有綁定, member的資料
    const foundCourses = await Course.find({}).populate('instructor', ['name', 'email'])
    res.send(foundCourses)
  }catch(err){
    res.status(500).send('course not found !')
  }
  
})

// 搜尋單筆課程
router.get('/:_id', async(req, res)=>{

  try{
    // 從路由取得參數
    const { _id } = req.params;
    const foundCourses = await Course.findOne({_id}).populate('instructor', ['email'])

    console.log('foundCourses', foundCourses)
    res.status(200).send(foundCourses)
  }
  catch(err){
    res.status(500).send('course not found!')
  }
})

// patch修改課程資料
router.patch('/:_id', async(req, res)=>{

  // 驗證課程輸入是否有誤
  const validationResult = courseValidation(req.body);
  let {error} = validationResult;
  if(error){ return res.status(400).send(error) };

  // 尋找是否有這個課程
  const { _id } = req.params;
  const foundCourse = await Course.findOne({ _id });

  // Course.findOneAndUpdate({_id}, req.body).then((updatedData)=>{
  //   res.send({message:'updated', updatedData})
  // })
  
  // 如果課程存在, 用課程中綁定的註冊者id與 認證的user id是否一樣, #一樣是註冊的instructor才可以修改
  if(foundCourse){

    // 查證兩個mongoDB的ObjectId是否一樣
    if(foundCourse.instructor.equals(req.user._id)){
      Course.findOneAndUpdate({ _id }, req.body, {
        new:true,
        runValidators:true
      }).then(((response)=>{
        res.status(200).send({message:'updated!', response})
      })).catch((error)=>{
        return res.send(error)
      })
    }
    else{
      return res.send('only instructor cna revise it !')
    }
  }
  else{
    return res.send('not found!')
  }

  // res.send(validationResult)
})

// 刪除課程

router.delete('/:_id', async(req, res)=>{
  const { _id } = req.params;
  const foundCourse =  await Course.findOne({_id});

  // 如果有找到課程, 並且user == instructor
  if(foundCourse){
    const isInstructor = foundCourse.instructor.equals(req.user._id);

    // 是instructor才可以刪除
    if(isInstructor){
      try{
        let deletedCourse = await Course.findOneAndDelete({_id});
        return res.status(200).send({message:'Deleted!', deletedCourse})
      }catch(e){
        res.status(400);
        return res.send(e);
      }
    }
    else{
      return res.status(403).send('you cant delete this course')
    }
  }

  return res.status(400).send('not found!')
})

module.exports = router;
