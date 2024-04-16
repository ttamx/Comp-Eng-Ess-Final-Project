import express from 'express';

import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.post('/addUser', roomController.addUserToRoom);

export default router;