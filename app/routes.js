var express = require('express');
var router = express.Router();

var passport = require('./auth/facebook');

const APIController = require('./controllers/APIController');
const HomeController = require('./controllers/HomeController');
const PagesController = require('./controllers/PagesController');
const MessengerController = require('./controllers/MessengerController');

const MiddlewareBag = require('./middlewares');

router.get('/', PagesController.getIndex);
router.get('/db/reset', PagesController.getDbReset);

router.get("/auth/facebook", passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/dashboard' }));

router.get('/dashboard', MiddlewareBag.isLoggedIn, PagesController.getDashboard);

router.get('/logout', MiddlewareBag.isLoggedIn, PagesController.getLogOut);

router.get('/home/setup', MiddlewareBag.isLoggedIn, HomeController.getHomeSetup);
router.post('/home/setup', MiddlewareBag.isLoggedIn, HomeController.postHomeSetup);

router.get('/message', MessengerController.getMessage);
router.post('/message', MessengerController.postMessage);

router.get('/api/register', APIController.getRegister);

router.get('/api/instructions', MiddlewareBag.isTokenValid, APIController.getInstructions);

module.exports = router;