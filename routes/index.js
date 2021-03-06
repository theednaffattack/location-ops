const express = require("express");
const locationController = require("../controllers/locationController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

// Ye olde entry point
// router.get('/', locationController.homePage);

router.get("/", locationController.getLocations);
router.get("/locations", locationController.getLocations);

router.get(
  "/add",
  authController.isLoggedIn,
  catchErrors(locationController.addLocation)
);

router.post(
  "/add",
  locationController.upload, // read the file into memory
  catchErrors(locationController.resize), // resize & save to disk
  catchErrors(locationController.createLocation)
); // create location

router.post(
  "/add/:id",
  locationController.upload, // read the file into memory
  catchErrors(locationController.resize), // resize & save to disk
  catchErrors(locationController.updateLocation)
);

router.get(
  "/locations/:id/edit",
  authController.isLoggedIn,
  catchErrors(locationController.editLocation)
);

router.get(
  "/location/:slug",
  catchErrors(locationController.getLocationBySlug)
);

router.get("/tags/", catchErrors(locationController.getStoresByTag));
router.get("/tags/:tag", catchErrors(locationController.getStoresByTag));

// * A dummy route that reverses the next param
router.get("/reverse/:name", locationController.reverse);

router.get("/login", userController.loginForm);
router.post("/login", authController.login);
router.get("/register", userController.registerForm);

// validate the registration data
// register the user
// log the new user in
router.post(
  "/register",
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get("/logout", authController.logout);

router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.post(
  "/reviews/:id",
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);

/*
  API
*/

router.get("/api/v1/search", catchErrors(locationController.searchLocations));

router.get(
  "/api/v1/locations/near",
  catchErrors(locationController.mapLocations)
);
router.get("/map", locationController.mapPage);

router.post(
  "/api/v1/locations/:id/heart",
  catchErrors(locationController.heartLocation)
);

router.get("/hearts", catchErrors(locationController.getHearts));

router.get("/top", catchErrors(locationController.getTopLocations));

module.exports = router;
