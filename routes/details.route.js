const route = require('express').Router();
const {detailsController}  = require('../controllers') 
const {authMiddleware}  = require('../middlewares') 

route.use(authMiddleware) ;

route.post("/subscribe"  , detailsController.subscribe )
route.post("/pay"  , detailsController.makePayment )
route.get("/details", detailsController.getDetails)
route.put('/changeBatch/:_id' , detailsController.changeBatch)
module.exports = route ;
