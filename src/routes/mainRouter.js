const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { isAuthenticated, isNotAuthenticated } = require("../middleware/auth");
const User = require("../models/user");
const CurrencyService = require("../services/currencyService");
const Conversion = require("../models/conversion");
const { hasMessages } = require("../utils/flash");

const validateRegistration = [
  body("username").trim().isLength({ min: 3 }).escape(),
  body("password").isLength({ min: 6 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

router.get("/", (req, res) => {
  res.render("index", {
    hasMessages: hasMessages(res.locals.messages),
  });
});

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", {
    hasMessages: hasMessages(res.locals.messages),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", {
    hasMessages: hasMessages(res.locals.messages),
  });
});

router.post("/register", validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0].msg);
    return res.redirect("/register");
  }

  try {
    await User.create(req.body.username, req.body.password);
    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", "Username already exists");
    res.redirect("/register");
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

router.get("/convert", isAuthenticated, async (req, res) => {
  try {
    const currencies = await CurrencyService.getCurrency();
    res.render("convert", {
      result: null,
      currencies: Object.keys(currencies.rates),
      hasMessages: hasMessages(res.locals.messages),
    });
  } catch (err) {
    req.flash("error", "Failed to fetch currencies");
    res.redirect("/");
  }
});

router.get("/about", async (req, res) => {
  res.render("about");
});

router.post("/convert", isAuthenticated, async (req, res) => {
  try {
    const { baseAmount, baseCurrency, targetCurrency } = req.body;
    const currencies = await CurrencyService.getCurrency();

    const result = await CurrencyService.convert(
      baseCurrency,
      targetCurrency,
      baseAmount
    );
    res.render("convert", {
      result,
      currencies: Object.keys(currencies.rates),
      hasMessages: hasMessages(res.locals.messages),
    });
  } catch (err) {
    req.flash("error", "Conversion failed");
    res.redirect("/convert");
  }
});

router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate, baseCurrency, targetCurrency } = req.query;
    let historicalData;

    if (startDate && endDate) {
      historicalData = await CurrencyService.getCurrencyByDateRange(
        startDate,
        endDate,
        baseCurrency,
        targetCurrency
      );
    }

    const currencies = await CurrencyService.getCurrency();
    res.render("history", {
      currencies: Object.keys(currencies.rates),
      historicalData,
      baseCurrency,
      targetCurrency,
      hasMessages: hasMessages(res.locals.messages),
    });
  } catch (err) {
    req.flash("error", "Failed to fetch historical data");
    res.redirect("/");
  }
});

router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const conversions = await Conversion.getByUserId(req.user.id);
    res.render("user", {
      conversions,
      hasMessages: hasMessages(res.locals.messages),
    });
  } catch (err) {
    req.flash("error", "Failed to fetch conversions");
    res.redirect("/");
  }
});

router.post("/save-conversion", isAuthenticated, async (req, res) => {
  try {
    const conversion = JSON.parse(req.body.conversion);
    await Conversion.save(
      req.user.id,
      conversion.base,
      conversion.target,
      conversion.amount,
      conversion.result,
      new Date()
    );
    req.flash("success", "Conversion saved successfully");
  } catch (err) {
    req.flash("error", "Failed to save conversion");
  }
  res.redirect("/convert");
});

router.post("/remove-conversion", isAuthenticated, async (req, res) => {
  try {
    await Conversion.remove(req.body.id, req.user.id);
    req.flash("success", "Conversion removed successfully");
  } catch (err) {
    req.flash("error", "Failed to remove conversion");
  }
  res.redirect("/user");
});

module.exports = router;
