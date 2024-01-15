import { User } from "../models/user.models.js"

const index = (req, res) => {
  res.render('index', { title: 'Home', isLoggedin: req.isAuthenticated() });
}

const register = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(302, "secret")
  } else {
    res.render('register', { title: 'Sign Up' })
  }
}

const signUp = async (req, res) => {
  const { username, email, fullName, password } = req.body

  const existingUser = await User.findOne({ email: email })

  if(existingUser){
    return new Error("User already Exist with this email!")
  }

  const createUser = await User.create({
    email,
    password,
    fullName,
    username
  })

  const user = await User.findOne({ _id: createUser?._id })

  if(!user){
    return new Error('Something Went Wrong while registering the User!')
  }

  res.redirect(302, "login")

}

const login = (req, res) => {
  if(req.isAuthenticated()){
    res.redirect(302, "secret")
  } else {
    res.render('login', { title: 'Login' });
  }
}

const secret = (req, res) => {
  console.log("current user", req.user);
  res.render('secret', { title: 'Secret Page' })
}

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export { index, login, secret, logout, signUp, register }