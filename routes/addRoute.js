const express = require('express');
const router = express.Router();
const { createUser, loginUserCtrl, getAllUser, getaUser, deleteaUser, updateaUser } = require('../controller/userCtrls');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlerware');

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users', getAllUser)
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);
router.put("/edit-user", authMiddleware, updateaUser);
router.put("/block-user/:id", authMiddleware, isAdmin, updateaUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, updateaUser);
module.exports = router;