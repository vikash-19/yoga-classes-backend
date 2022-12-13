const {Users , Subscriptions , Payments} =  require('../db') ;
const moment  = require('moment') ;


const  isPrevPaymentDue = async (username)=>{
        
    const currMonthStartDate =  moment().date(1) ;
        const prevSubscriptions =  await Subscriptions.find({
            username , 
            date:{$lt:currMonthStartDate},

        })


        if(prevSubscriptions.length == 0 ){
            return false
        }
        else{
            prevSubscriptions.sort({date : -1}) ;
            const prevSubscription = prevSubscriptions[prevSubscriptions.length - 1 ] ;
            const sid =  prevSubscription._id ;
            const payment  = await Payments.findOne({sid});
            if(!payment){
                return true;
            }
            else{
                return false ;
            }

        }
}


const getDetails = async (req , res)=>{
    console.log(req.session)
    try{
        const username =  req.session.username ;
        const prevPaymentDue = isPrevPaymentDue(username) 
        const user = await Users.findOne({username}) ;
        
        const currMonthStartDate =  moment().date(1) ;
        const currSubscription =  await Subscriptions.findOne({
            username , 
            date:{$gte:currMonthStartDate} 
        })

        let payment = null ;

        if(currSubscription){
            const sid = currSubscription._id ;
            payment  = await Payments.findOne({sid}) ;
        }


        

        const details = {
            firstName : user.firstName,
            lastName : user.lastName,
            dateOfBirth : user.dateOfBirth,
            currSubscription,
            payment,
            username,
            prevPaymentDue : await prevPaymentDue
        }
        res.json(details) ;


    }catch(err){
        console.log(err.message??"Internal server error in subscription!") ;
        res.status(501).send(err.message??"Internal server error in subscription!") ;
    }

}


const subscribe = async (req , res) =>{
    try{

        const username =  req.session.username , batch = req.body.batch ;
        
        const currMonthStartDate =  moment().date(1) ;
        const currSubscription =  await Subscriptions.findOne({
            username , 
            date:{$gte:currMonthStartDate} 
        })
   
        if(currSubscription){
            return res.send("Already Subscribed!")  ;
        }

        const prevMonthStartDate =  moment().date(0).date(1) ;
        const prevSubscriptions =  await Subscriptions.find({
            username , 
            date:{$lt:currMonthStartDate},

        }).sort({date : -1}).limit(1) ;


        if(prevSubscriptions.length === 0 ){
            const newSubscription = new Subscriptions({
                batch,
                date : new Date() ,
                username 
            });

            await newSubscription.save()  ;
            return res.status(200).send("Subscribed!") ;

        }
        else{
            const prevSubscription = prevSubscriptions[0] ;
            const sid =  prevSubscription._id ;


            const payment  = await Payments.findOne({sid});
            if(!payment){
                return res.status(420).send("Previous Payment Due!")
            }
            else{
                const newSubscription = new Subscriptions({
                    batch,
                    date : new Date() ,
                    username 
                });
    
                await newSubscription.save()  ;
                return res.status(200).send("Subscribed!") ;
            }

        }


    }catch(err){
        console.log(err.message??"Internal server error in subscription!") ;
        res.status(501).send(err.message??"Internal server error in subscription!") ;
    }
}


const makePayment = async (req  , res) => {
    try{
        const username  = req.session.username ;
        const currMonthStartDate =  moment().date(1) ;
        
        const currSubscription =  await Subscriptions.findOne({
            username , 
            date:{$gte:currMonthStartDate} 
        }) ;

        if(!currSubscription){
            return res.status(404).send('Please subscribe first!') ;
        }

        const payment  = await Payments.findOne({sid : currSubscription._id}) ;
        if(payment){
            return res.status(420).send("Fees Already paid!") ;
        }


        const newPayment  = new Payments({
            sid : currSubscription._id
        });

        await newPayment.save()  ;
        res.send("Payment Successfull!") ;


    }catch(err){
        console.log(err.message??"Payment failed!") ;
        res.status(501).send(err.message??"Payment failed!") ;
    }
}

const changeBatch = async (req, res)=>{
    try{
        const username = req.session
        const {batch } = req.body
        const {_id} = req.params
        await Subscriptions.updateOne({_id},{batch})

        res.send("changed")
    } catch (err){
        console.log('failed changing batch')
        res.status(501).send("failed changing batch")
    }

}

module.exports  =  {getDetails , subscribe , makePayment , changeBatch}