const express = require('express');
const router = express.Router();
const {sendQueries,submitQuery, sendLeaderboardData, fetchStatus} = require('../controllers/competition.controller');
const { fetchLevel } = require('../controllers/user.controller');

router.get('/queries/:id',sendQueries)
router.get('/leaderboardData',sendLeaderboardData)
router.post('/submitFile',submitQuery);
router.get('/getSubmissionStatus',fetchStatus);
router.get('/fetchTeamLevel/:team_id',fetchLevel)


module.exports = router;