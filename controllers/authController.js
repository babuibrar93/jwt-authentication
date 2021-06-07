const User = require('../models/User')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

// handle errors
const handleErrors = (error) => {
    console.log(error.message, error.code);
    let errors = { email: '', password: '' };
  
    // incorrect email 
    if(error.message === 'Incorrect Email'){
     errors.email = 'Email is not Rejistered!'
    }

    // incorrect password 
    if(error.message === 'Incorrect Password'){
      errors.password = 'Incorrect Password!'
      console.log(errors.password)
    }

    // duplicate email error
    if (error.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (error.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(error.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
    return errors;
}

const maxAge = 60 * 60 * 24 * 3 // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({id}, 'thisismyjwt', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie('jwtCookie', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).send({user: user._id})
    } catch(error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body
    console.log(email, password)

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwtCookie', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})
    } catch(error) {
        const errors = handleErrors(error);
        console.log(errors)
        res.status(400).json({errors})
    }

}

module.exports.logout_get = (req, res) => {
    res.cookie('jwtCookie', '', { maxAge: 1 })
    res.redirect('/')
}