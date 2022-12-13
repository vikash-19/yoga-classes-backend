const { serializeInteger } = require('whatwg-url');
const mongoose  =  require('./db_connect')

const schema = new mongoose.Schema({
    price : {
        type : Number,
        required : true ,
        default : 500
    },
    batch : {
        type : String ,
        enum : ['6AM-7AM' , '7AM-8AM' , '8AM-9AM', '5PM-6PM'],
        default : '7AM-8AM' ,
        required : true 
    },
    date : Date,
    username : {
        type : String,
        ref : 'Users',
        required : true 
    }
} ,  ['Subscriptions']);

const model =  mongoose.model( 'Subscriptions' , schema) ;
module.exports = model;