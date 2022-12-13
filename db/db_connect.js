const mongoose  = require('mongoose');
mongoose.connect(`mongodb+srv://adminVikash:${process.env.PASSWORD}@cluster0.poh3ffy.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log('DB connected!')
})


module.exports = mongoose;

