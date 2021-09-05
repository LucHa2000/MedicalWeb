var nodemailer = require("nodemailer");//sendEmailConfirm
const Account = require('../models/Account')
const Random = Math.floor((Math.random() * 10000) + 100);
const {
    mutipleMongooseToObject
} = require('../../util/mongoose')
var nodemailer = require("nodemailer"); //sendEmailConfirm
const {
    mongooseToObject
} = require('../../util/mongoose')
nodemailer = require("nodemailer"); //sendEmailConfirm
class AuthController {
    index(req, res, next) {
        res.render('auth/login')
    }
    pageSignup_email(req, res, next) {
        res.render('auth/signup_email')
    }
    pageSignup(req, res, next) {
        res.render('auth/signup')
    }
    //auth [put] / register
    register(req, res, next) {
       
    }
    confirmEmail(req, res, next) {
        Account.findOne({email : req.body.confirmEmail})
        .then((accounts)=>{
            if(!accounts) { 

                res.send("check mail")
            }
            else{
                
      
                res.redirect('back')
            }
        })
        
        next()

    }
    
    logout(req,res,next){
        res.clearCookie('userId')
        res.clearCookie('userEmail')
        res.clearCookie('userName')
        res.redirect('/auth')
    }
    //[post] auth/user_login
    login(req, res, next) {
        Account.findOne({
                email: req.body.email
            })
            .then((accounts) => {
                if (accounts.password == req.body.password && accounts.account_status == 1 ) {
                       
                        if (req.body["g-recaptcha-response"]) {
                            res.cookie('userId', accounts._id)
                            res.cookie('userEmail', accounts.email)
                            res.cookie('userName', accounts.full_name)
                            if (accounts.accountType === 1) {
                                res.redirect('/')
                            } else {
                            
                                res.redirect('/admin')
                            }
                        } else {
                            res.render("auth/login", {
                                errorConfirm: "Check Confirm",
                                Email: req.body.email
                            })
                        }
                    
                } else {
                    res.render("auth/login", {
                        errorConfirm: "account not exist",
                        Email: req.body.email
                    })
                }

            })
            .catch(next)
    }
}
module.exports = new AuthController()