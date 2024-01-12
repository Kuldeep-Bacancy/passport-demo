const index = (req, res) => {
  res.render('index', { title: 'Home', isLoggedin: req.isAuthenticated() });
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


export { index, login, secret, logout}