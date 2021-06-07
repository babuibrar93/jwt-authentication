const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwtCookie

    // check jwt token exist & is verified
    if(!token){
       return res.redirect('/login')
    } else {
        jwt.verify(token, 'thisismyjwt', (error, decodedToken) => {
            if(error) {
                console.log(error.message)
                 res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } 
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwtCookie

    // check jwt token exist & is verified
    if(!token){
       res.locals.user = null
       next()
    } else {
        jwt.verify(token, 'thisismyjwt', async (error, decodedToken) => {
            if(error) {
                console.log(error.message)
                res.locals.user = null
                next()
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    } 
}

module.exports = { authMiddleware, checkUser }
