const router = require("express").Router();
const db = require("../../models/user");
const uuid = require("uuid");
router.post("/create", async (req, res) => {
  console.log(req.body);
  db.findOne({ username: req.body.username }, async (err, data) => {
    if (data) res.status(500).send({ error: "Username already exist" });
    else {
      const ndb = {
        id: uuid.v4(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };
      new db(ndb).save();
      res.send(ndb);
    }
  });
});
module.exports = router;
