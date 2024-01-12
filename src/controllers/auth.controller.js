const index = (req, res) => {
  res.render('index', { title: 'Home' });
}

const login = (req, res) => {
  res.render('login', { title: 'Login' });
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