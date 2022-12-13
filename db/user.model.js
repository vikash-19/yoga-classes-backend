const mongoose  =  require('./db_connect')
const schema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true 
    }, 
    firstName : {
        type : String ,
        required : true 
    },
    lastName : String,
    dateOfBirth : Date,
    hashedPasswd : String
} ,  ['Users']);

const model =  mongoose.model( 'Users' , schema) ;
module.exports = model;