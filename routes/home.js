///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

///////////////////////////////
// Custom Middleware
////////////////////////////////

const addUserToRequest = async (req, res, next) => {
  if (req.session.userId) {
    req.user = await User.findById(req.session.userId);
    next();
  } else {
    next();
  }
};

const isAuthorized = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

router.use(addUserToRequest);

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
  res.render("home");
});

//Sign Up Routes
router.get("/auth/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/auth/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    await User.create(req.body);
    res.redirect("/auth/login");
  } catch (error) {
    res.json(error);
  }
});

//Login Routes
router.get("/auth/login", (req, res) => {
  res.render("auth/login");
});

router.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        req.session.userId = user._id;
        res.redirect("/stocks");
      } else {
        res.json({ error: "Password Does Not Match" });
      }
    } else {
      res.json({ error: "User Does Not Exist" });
    }
  } catch (error) {
    res.json({ error: "Error" });
  }
});

//Logout Route
router.get("/auth/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/");
});

//Index
router.get("/stocks", isAuthorized, async (req, res) => {
  res.render("stocks", { stocks: req.user.stocks });
});

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
