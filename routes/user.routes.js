const express = require('express');
const { loginUser, logoutUser, registerUser, retrieveCookie,deleteParticipants, getDashboard, markTutorialDone } = require('../controllers/user.controller');
const router = express.Router();

router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/logout',logoutUser);
router.get('/check-session',retrieveCookie);
router.get('/getMyDashboard/:id',getDashboard);
router.post('/tutorialDone',markTutorialDone);
router.post('/deleteParticipants',deleteParticipants);
module.exports = router;