module.exports =  async (req, res , next)=>{
    try{
        
        const session = req.session ;
        if(!session.username)
            return res.status(401).send("unauthorized Access!")

        req.body.username  = session.username ;
        next();
    }catch(err){
        console.log(err.message??'Internal error ');
        res.status(501).send(err.message??'Internal error') ;
    }
}