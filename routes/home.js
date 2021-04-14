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

//New
router.get("/stocks/new", isAuthorized, (req, res) => {
  res.render("new");
});

//Destroy
router.delete("/stocks/:id", isAuthorized, async (req, res) => {
  const id = req.params.id;
  const index = req.user.stocks.findIndex((stock) => `${stock._id}` === id);
  req.user.stocks.splice(index, 1);
  req.user.save();
  res.redirect(`/stocks`);
});

//Update
router.put("/stocks/:id", isAuthorized, async (req, res) => {
  const id = req.params.id;
  const index = req.user.stocks.findIndex((stock) => `${stock._id}` === id);
  req.user.stocks[index].name = req.body.name;
  req.user.stocks[index].ticker = req.body.ticker;
  req.user.stocks[index].price = req.body.price;
  req.user.stocks[index].stockQty = req.body.stockQty;
  //   console.log(req.user.stocks, id);
  req.user.save();
  res.redirect(`/stocks/${id}`);
});

//Create
router.post("/stocks", isAuthorized, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  user.stocks.push(req.body);
  await user.save();
  res.redirect("/stocks");
});

//Edit
router.get("/stocks/:id/edit", isAuthorized, async (req, res) => {
  const id = req.params.id;
  const index = req.user.stocks.findIndex((stock) => {
    return `${stock._id}` === id;
  });
  const stock = req.user.stocks[index];
  res.render("edit", { stock });
});

//Show
router.get("/stocks/:id", isAuthorized, (req, res) => {
  const id = req.params.id;
  const index = req.user.stocks.findIndex((stock) => {
    return `${stock._id}` === id;
  });
  const stock = req.user.stocks[index];
  //   console.log(id, index, stock._id, stock);
  res.render("show", { stock });
});

///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router;
