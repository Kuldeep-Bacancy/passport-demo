import express from "express"
import expressEjsLayouts from "express-ejs-layouts"
import session from "express-session"
import { User } from "./models/user.models.js"
import passport from "passport"
import morgan from "morgan"

const app = express()

app.use(expressEjsLayouts)
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes
import authRouter from "./routes/auth.routes.js"

app.use('/', authRouter)

export default app