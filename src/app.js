import express from "express"
import expressEjsLayouts from "express-ejs-layouts"
import session from "express-session"
import { User } from "./models/user.models.js"
import passport from "passport"
import morgan from "morgan"
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import { Strategy as LocalStrategy } from 'passport-local';

const app = express()

app.use(expressEjsLayouts)
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// Setup Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

// For local login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function(req, email, password, done){
      try {
        //find the user in our database 
        let user = await User.findOne({ email: email })

        if (!user) { return done(null, false); }

        const passwordCheck = user.isPasswordCorrect(password)

        if(!passwordCheck) { return done(null, false) }

        done(null, user)
      } catch (err) {
        console.error(err)
        done(null, false)
      }
    }
  )
)

// For google login
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    //get the user data from google 
    const newUser = {
      username: profile.given_name,
      password: "",
      fullName: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id
    }

    try {
      //find the user in our database 
      let user = await User.findOne({ providerId: profile.id })

      if (user) {
        //If user present in our database.
        done(null, user)
      } else {
        // if user is not preset in our database save user data to database.
        user = new User(newUser)
        user.save({ validateBeforeSave: false })
        done(null, user)
      }
    } catch (err) {
      console.error(err)
      done(null, false)
    }
  }
))

passport.serializeUser(
  (user, next) => {
    next(null, user._id);
  }
)
passport.deserializeUser(async (id, next) => {
  try {
    const user = await User.findById(id);
    if (user) next(null, user); // return user of exist
    else next(error, null); // throw an error if user does not exist
  } catch (error) {
    next(error, null)
  }
});


//routes
import authRouter from "./routes/auth.routes.js"

app.use('/', authRouter)

export default app