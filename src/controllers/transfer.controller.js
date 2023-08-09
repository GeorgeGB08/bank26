const User = require("../models/user.model")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

const UserService = require("./../services/user.service")
const TransferService = require("./../services/transfer.service")
const userService = new UserService()
const transferService = new TransferService()

exports.transfer = catchAsync(async(req,res,next) => {
    const {amount, accountNumberTransfer, accountNumberReceiver} = req.body

    if (accountNumberReceiver === accountNumberTransfer) {
        return next(
            new AppError(
                "The sender account cannot be the same as the destination account"
            )
        )
    }
    
    const sendingUser = await userService.findOne(accountNumberTransfer) 

    const receivingUser = await userService.findOne(accountNumberReceiver)

    if(receivingUser.amount < amount) {
        return next(new AppError ("insufficient balance"))
    }

    const amountSendingUser = sendingUser.amount - amount 
    const amountReceivingUser = receivingUser.amount + amount

    const updateSendingUserPromise = userService.updateAmount(
        sendingUser,
        amountSendingUser
    )

    const updateReceivingUserPromise = userService.updateAmount(
        receivingUser,
        amountReceivingUser
        )

  const transferPromise = transferService.create({
    amount, 
    senderUserId: sendingUser.id, 
    receiverUserId: receivingUser.id,
})

await Promise.all([
    updateSendingUserPromise, 
    updateReceivingUserPromise, 
    transferPromise
])

return res.status(201).json({
    status: "success",
    message: "Transfer done correctly "
})

}) 


