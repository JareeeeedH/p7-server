const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    id:{ 
        type:String
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    // pending !!!
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    studends:{
        type:[String],
        default:[],
    }
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;