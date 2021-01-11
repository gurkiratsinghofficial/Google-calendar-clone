require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const { validation } = require("../validation/validation");
const { constants } = require("../constants/constants");
const { sendResponse } = require("../response/sendResponse");

const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

/**setup nodemailer */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * @description:userControl (object) contains all the functions related to User
 */
exports.userControl = {
  /**
   * @description: Sign up user and add new user in database
   * @param {object} req
   * @param {object} res
   */
  signUp: async (req, res) => {
    try {
      //Validate request
      const { error } = validation.signupValidation(req.body);
      if (error) return sendResponse(error.details[0].message, res, 400);

      //Check if user exists
      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist) return sendResponse(constants.EMAIL_EXIST, res, 400);

      //Encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const cloud = await cloudinary.uploader.upload(req.file.path);
      //Create new user
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone,
        profilePhoto: cloud.url,
      });
      //Save user in database
      const savedUser = await user.save();
      if (savedUser) {
        const emailToken =jwt.sign({_id:savedUser._id},process.env.TOKEN,{expiresIn:"1d"})
        const url=`https://eventify-calendar.herokuapp.com/api/users/confirmation/${emailToken}`
        await transporter.sendMail({
          to:savedUser.email,
          subject:"Eventify | confirm email address",
          html:`<a href="${url}">Click here</a> to verify your Eventify account!`
        })
        return sendResponse(constants.SIGNUP_SUCCESS, res, 200);
      }
      else return sendResponse(constants.SIGNUP_FAILED, res, 500);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: email confirmation route
   * @param {object} req 
   * @param {object} res 
   */
  confirmation:async(req,res)=>{
    try{
      const id=  jwt.verify(req.params.token,process.env.TOKEN)
      const userInfo = await User.findOne({ _id: id._id });
      if(userInfo){
        await userInfo.updateOne({ activation:true  })
        return res.redirect("https://eventify-manager.netlify.app")
      }else return sendResponse(constants.ACTIVATION_FAILED, res, 500);
      
    }catch(err){
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: Update user details
   * @param {object} req
   * @param {object} res
   */
  update: async (req, res) => {
    try {
      /**Verify JWT token */
      const token = req.header(constants.AUTHORISATION);
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID)return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Validate incoming request */
      const { firstname, lastname, phone, address } = req.body;
      const { error } = validation.updateValidation({
        firstname,
        lastname,
        phone,
        address,
      });
      if (error)
        return sendResponse(
          {
            success: constants.FALSE,
            message: error.details[0].message,
          },
          res,
          500
        );
      /**check if user exists or not */
      const userInfo = await User.findOne({ _id: userID._id });
      if (!userInfo) return sendResponse(constants.USER_NOT_FOUND, res, 500);
      /**update the user information */
      const updated = await userInfo.updateOne({
        firstname: firstname ? firstname : undefined,
        lastname: lastname ? lastname : undefined,
        phone: phone ? phone : undefined,
        address: address ? address : undefined,
      });
      if (req.file){
        const cloud = await cloudinary.uploader.upload(req.file.path);
        await userInfo.updateOne({
          profilePhoto: cloud.url,
        });
      }
      if (!updated) return sendResponse(constants.CANNOT_UPDATE_USER, res, 500);
      else return sendResponse(constants.USER_UPDATED, res, 200);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: login user and send JWT token in response
   * @param {object} req
   * @param {object} res
   */
  login: async (req, res) => {
    try {
      // Validate request
      const { error } = validation.loginValidation(req.body);
      if (error) return sendResponse(error.details[0].message, res, 400);

      //Check if user exists
      const user = await User.findOne({ email: req.body.email });
      if (!user) return sendResponse(constants.USER_NOT_FOUND, res, 400);

      //Check if email address is verified
      if(!user.activation) return sendResponse(constants.VERIFY_EMAIL, res, 500);

      //Compare passwords
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return sendResponse(constants.WRONG_CREDS, res, 400);

      //Create and assign a token
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
      const response = {
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        address: user.address,
        profilePhoto: user.profilePhoto,
      };
      return res.header(constants.AUTHORISATION, token).send({
        success: constants.TRUE,
        message: constants.LOGIN_SUCCESS,
        user: response,
        token: token,
        events: user.events,
      });
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**
   * @description: returns user details corresponding to a user id
   * @param {object} req
   * @param {object} res
   */
  findOneUser: async (req, res) => {
    try {
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**Check if user exists */
      const userinfo = await User.findOne({ _id: userID._id });
      if (!userinfo) return sendResponse(constants.INVALID_LOGIN, res, 500);
      else {
        /**Send user details in response */
        const response = {
          firstname: userinfo.firstname,
          lastname: userinfo.lastname,
          phone: userinfo.phone,
          email: userinfo.email,
          address: userinfo.address,
          profilePhoto: userinfo.profilePhoto,
        };
        return sendResponse(
          {
            success: constants.TRUE,
            message: constants.USER_FETCH,
            user: response,
            events: userinfo.events,
          },
          res,
          200
        );
      }
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
  /**sends all users email IDs for guestlist component */
  allUserData: async (req, res) => {
    try {
      /**Fetch token from request headers */
      const token = req.header(constants.AUTHORISATION);
      /**Verify the token */
      const userID = jwt.verify(token, process.env.TOKEN);
      if (!userID) return sendResponse(constants.USER_NOT_SIGN, res, 500);
      /**find the requesting user */
      const requestingUser = await User.findOne({ _id: userID._id });
      const users = await User.find();
      if (!users) return sendResponse(constants.USER_NOT_FOUND, res, 400);
      let responseData = [];
      for (let i = 0; i < users.length; i++) {
        /**Donot push the requesting user details in response */
        if (users[i].email !== requestingUser.email) {
          let obj = {
            _id: users[i]._id,
            label: users[i].email,
            chipLabel: users[i].firstname,
            value: users[i].email,
          };
          responseData.push(obj);
        }
      }
      constants.GET_USERS_SUCCESS.data = responseData;
      return sendResponse(constants.GET_USERS_SUCCESS, res, 200);
    } catch (err) {
      return sendResponse(err.message, res, 500);
    }
  },
};
