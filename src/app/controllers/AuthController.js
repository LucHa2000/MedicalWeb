var nodemailer = require('nodemailer'); //sendEmailConfirm
const Account = require('../models/Account');
let Random = Math.floor(Math.random() * 1000000 + 100).toString();
const {
  mutipleMongooseToObject
} = require('../../util/mongoose');
var nodemailer = require('nodemailer'); //sendEmailConfirm
const {
  mongooseToObject
} = require('../../util/mongoose');
nodemailer = require('nodemailer'); //sendEmailConfirm
class AuthController {
  //render page Login
  index(req, res, next) {
    res.clearCookie('email');
    res.clearCookie('code');
    res.clearCookie('code');
    res.render('auth/login', {
      errorConfirm: req.cookies.errorConfirm,
      message: req.cookies.message,
    });
    res.clearCookie('message');
    res.clearCookie('errorConfirm');
  }
  //[post] auth/user_login
  login(req, res, next) {
    Account.findOne({
        email: req.body.email,
      })
      .then((accounts) => {
        if (accounts) {
          if (
            (accounts.password.trim() == req.body.password &&
              accounts.account_status == 1) ||
            accounts.deleted == true
          ) {
            if (req.body['g-recaptcha-response']) {
              res.cookie('userId', accounts._id);
              res.cookie('author', true);
              res.cookie('userEmail', accounts.email);
              res.cookie('userName', accounts.full_name);
              res.cookie('accountType', accounts.accountType);
              if (accounts.accountType === 1) {
                res.redirect('/');
              } else {
                res.redirect('/admin');
              }
            } else {
              res.cookie('errorConfirm', 'Please check confirm');
              res.redirect('back');
            }
          } else {
            res.cookie('errorConfirm', 'Wrong Password');
            res.redirect('back');
          }
        } else {
          res.cookie('errorConfirm', 'The account does not exist yet');
          res.redirect('back');
        }
      })
      .catch(next);
  }
  //render page signup
  pageSignup(req, res, next) {
    if (req.cookies.code) {
      res.clearCookie('code');
      res.render('auth/signup');
    } else {
      res.redirect('/auth/singup_email');
    }
  }
  //auth [put] / register
  register(req, res, next) {
    if (req.body.password != '') {
      req.body.address = '';
      req.body.account_status = 1;
      req.body.accountType = 1;
      req.body.email = req.session.email
      const newAccount = new Account(req.body);
      newAccount.save();

      res.clearCookie('email');
      res.clearCookie('error');
      res.cookie('message', 'Resister successful');
      res.redirect('/auth/login');
    }
  }

  pageCode(req, res, next) {
    res.clearCookie('error');
    res.cookie('code', req.cookies.code);
    res.render('auth/confirmEmail_view', {
      error: req.cookies.error,
      message: req.cookies.message,
    });
  }
  confirmCode(req, res, next) {
    if (req.body.code == req.session.code) {
      res.render('auth/signup');
    } else {
      res.clearCookie('message');
      res.cookie('error', 'Verification codes is not correct');
      res.redirect('back');
    }
  }
  sendMail(req, res, next) {
    Account.findOne({
      email: req.body.confirmEmail,
    }).then((accounts) => {
      if (!accounts) {
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'danchoiphonui27@gmail.com', // generated ethereal user
            pass: 'danchoiphonui27', // generated ethereal password
          },
        });
        var mailMessage = {
          from: 'danchoiphonui27@gmail.com',
          to: req.body.confirmEmail,
          subject: 'Confirm Email',
          text: Random,
        };
        transporter.sendMail(mailMessage, function (error, data) {});
        //res.cookie('code', Random);
        req.session.code = Random
        // res.cookie('email', req.body.confirmEmail);
        req.session.email = req.body.confirmEmail
        res.cookie('message', 'Check your email');
        res.redirect('/auth/pageCode');
      } else {
        res.cookie('error', 'The account already exists');
        res.redirect('back');
      }
    });

    next();
  }
  pageForgotPassword(req, res, next) {
    res.render('auth/forgotPassword', {
      error: req.cookies.error,
    });
    res.clearCookie('error');
  }
  pageSignup_email(req, res, next) {
    res.render('auth/signup_email', {
      error: req.cookies.error,
    });
    res.clearCookie('error');
  }
  sendAccount(req, res, next) {
    Account.findOne({
      email: req.body.forgotEmail,
    }).then((accounts) => {
      if (accounts) {
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'danchoiphonui27@gmail.com', // generated ethereal user
            pass: 'danchoiphonui27', // generated ethereal password
          },
        });
        var mailMessage = {
          from: 'danchoiphonui27@gmail.com',
          to: req.body.forgotEmail,
          subject: 'Forgot Email',
          text: `Your User Name : ${accounts.email} \n Your Password : ${accounts.password}`,
        };
        transporter.sendMail(mailMessage, function (error, data) {});
        res.cookie('message', 'Please check your email');
        res.redirect('/auth/login');
      } else {
        res.cookie('error', 'The account does not exist yet');
        res.redirect('back');
      }
    });

    next();
  }
  logout(req, res, next) {
    res.clearCookie('userId');
    res.clearCookie('userEmail');
    res.clearCookie('userName');
    res.clearCookie('accountType');
    res.clearCookie('author');
    res.clearCookie('totalQty');
    res.redirect('/');
  }
}
module.exports = new AuthController();