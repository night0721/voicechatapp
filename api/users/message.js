const router = require("express").Router();
router.post("/message", async (req, res) => {
  res.send({ code: 200 });
});
module.exports = router;
