const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const url = 'mongodb://127.0.0.1:27017/users-auth'
mongoose.connect(url, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const userSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: [true, 'Please provide an email!'],
        trim: true,
        unique: true,
        lowercase: true,
        validate(email){
            if(!validator.isEmail(email)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [6, 'password must be at least of 6 length']
    }
})

// fire the function after doc saved to database
userSchema.post('save', function (doc, next) {
    console.log('New user added and saved ', doc)

    next()
})

// fire the function before doc saved to database
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    console.log(this.password)

    next();
})
 
// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if(user) {
       const auth = await bcrypt.compare(password, user.password)
       if(auth) {
        return user
       }
       throw new Error('Incorrect Password')
    }
       throw new Error('Incorrect Email')
}


const User = mongoose.model('user', userSchema)

module.exports = User;