const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const { authMiddleware, checkUser } = require('./middleware/authMiddleware')

const authRoutes = require('./routes/authRoutes')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()) // It takes json data that comes along with request and it parse into js object
app.use(cookieParser()) // middleware

// view engine
app.set('view engine', 'ejs');

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', authMiddleware, (req, res) => res.render('smoothies'));
app.use(authRoutes)


// Cookies 
// app.get('/set-cookies', (req, res) => {
//    // res.setHeader('set-cookies', ('newUser=true'))
//       res.cookie('newUser', 'false')
//       res.cookie('isEmployee', 'true', {maxAge: 1000 * 60 * 60 * 24, httpOnly:true}, )


//     res.send('you got the cookies!')
// })


// app.get('/read-cookies', (req, res) => {
//     const cookies = req.cookies
//     console.log(cookies)

//     res.json(cookies)
//  })
 
app.listen(8000)

