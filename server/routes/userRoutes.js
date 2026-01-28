import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(protect); // All routes protected
router.use(authorize('admin')); // All routes admin only

router.route('/')
    .get(getUsers);

router.route('/:id/role')
    .put(updateUserRole);

export default router;
