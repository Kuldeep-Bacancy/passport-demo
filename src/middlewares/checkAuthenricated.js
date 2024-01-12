const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  console.log("User is not authenticated!!!!!!")
  res.redirect("/login")
}

export default checkAuthenticated