const catchAsync = require('../utils/catchAsync');
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/jwt");
const User = require("../models/user.model");
const accountNumberGenerator = require("../utils/accountNumberGenerator");
const AppError = require('../utils/appError');


exports.signup = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

 const accountNumber = accountNumberGenerator()

 
 const user = await User.create({
    name,
    password,
    accountNumber,
    amount: 1000,
 }) 

  const token = await generateJWT(user.id)


//  const salt = await bcrypt.genSalt(12)
//  const secretPassword = await bcrypt.hash(password, salt)



 return res.status(201).json({
    status: "sucess",
    token,
    user,
 })

});

exports.login = catchAsync(async (req, res, next) => {

   const {password} = req.body
      
   const {user} = req 

   if(!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect accountNumber or password"))
   }
    
   const token = await generateJWT(user.id)

    res.status(200).json({
        status:"success",
        token,
        user,
    })
});
