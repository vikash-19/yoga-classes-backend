const express =  require('express') ;
const app =  express() ;
const path = require("path");
const {registerRoute, loginRoute , detailsRoute} = require('./routes') ;
const bodyParser = require('body-parser') ;
const session = require('cookie-session') ;
const cookieParser = require('cookie-parser');
const cors = require("cors");
// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'", "http://localhost:8000"],

    },
  })
);
app.use(xss());

app.use(
  cors({
    credentials: true,
    origin: [
      "https://yoga-classes-booking.onrender.com",
      "http://localhost:8000",
    ],
  })
);

app.set("trust proxy", 1); // trust first proxy

app.use(express.static(path.resolve(__dirname + "/client/build")));
app.get("*", (req, res) => {
res.sendFile(path.resolve(__dirname + "/client/build/index.html"));
});


app.use(cors())
app.use(session({
    secret: process.env.SECRET_KEY ,
    resave: false,
    saveUninitialized: true,
    cookie: {  maxAge :  30000},
  }))

app.use(bodyParser.json()) ;

app.use('/api/register' , registerRoute ) ;
app.use('/api/login', loginRoute) ;
app.get('/api/logout' , (req , res)=>{
    try{
        req.session = null ;
        res.status(200).send("Logout successfull!");
    }catch(err){
        console.log(err.message??"Logout failed!")
        res.status(501).send(err.message??"Logout failed!") ;
    }
    
})


app.use('/api', detailsRoute) ;



module.exports =  app  ;