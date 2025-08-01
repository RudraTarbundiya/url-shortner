const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    ShortedURl :{
        type:String,
        unique:true,
        required:true,
    },
    OrginalURl :{
        type:String,
        required:true,
    },
    times:{
        type:Number,
        default:0,
    }
});

const urlmodel = mongoose.model('urlmodel',urlSchema);

module.exports = urlmodel;