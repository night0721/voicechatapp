const { model, Schema } = require("mongoose");
module.exports = model(
  "user",
  new Schema({
    id: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  })
);
