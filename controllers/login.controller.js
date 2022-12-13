const {Users} = require('../db')
const md5  = require('md5') ;

module.exports =  async (req, res , next)=>{
    console.log(req.session)
    try{
        const session =  req.session
        const {username , password}  =  req.body;
        const user = await Users.findOne({username});

        if(!user || md5(password) !== user.hashedPasswd)
            return res.status(403).send('Incorrect User/Password') ;

        session.username = req.body.username ;
        res.status(200).send('Login sucessfull!');
    }catch(err){
        console.log(err.message??'Login falied');
        res.status(501).send(err.message??'Login failed') ;
    }
}
