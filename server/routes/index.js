const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.use(require("./user"));
router.use(auth, require("./income"));
router.use(auth, require("./expense"));

module.exports = router;
