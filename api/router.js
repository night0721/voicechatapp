const router = require("express").Router();
const r1 = require("./users/create");
const r2 = require("./users/message");
const r3 = require("./auth/redirect");
router.use("/users", r1, r2);
router.use("/auth", r3);
module.exports = router;
