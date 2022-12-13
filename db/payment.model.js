const { serializeInteger } = require('whatwg-url');
const mongoose  =  require('./db_connect')

const schema = new mongoose.Schema({
    transcastionDate : {
        type : Date,
        default : ()=> new Date() 
    },
    sid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true ,
        ref : 'Subscriptions'
    }
} ,  ['Payments']);

const model =  mongoose.model( 'Payments' , schema) ;
module.exports = model;