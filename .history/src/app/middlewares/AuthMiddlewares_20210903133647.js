var nodemailer = require("nodemailer");//sendEmailConfirm
const {Account} = require('../models/Medical')
class AuthMiddlewares {
    index (req, res, next) {
        if(!req.cookies.userId){
            res.redirect("/auth")
            return
        }
        Account.find({_id: req.cookies.userId})
        .then((accounts)=>{
          if(!accounts) {          
            return;
             }
             next()
        })
    }

    registerCheck(req,res,next){
   
        
    }
  
    registerConfirmEmail(req,res,next){
        if(req.body.confirmEmail== '123')
        next()

    }
}
module.exports = new AuthMiddlewares()