import express from 'express';

import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/sendScore', userController.sendScore);
router.get('/leaderboard', userController.getLeaderboard);

export default router;