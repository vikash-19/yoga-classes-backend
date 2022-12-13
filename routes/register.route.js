const route = require('express').Router();
const bodyParser = require('body-parser') ;
const {registerController}  = require('../controllers') 
route.post("/" , registerController)

module.exports = route ;
