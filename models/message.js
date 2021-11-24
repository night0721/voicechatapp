const { model, Schema } = require("mongoose");
module.exports = model(
  "message",
  new Schema({
    id: {
      type: String,
      default: "",
    },
    messages: [
      {
        id: { type: String, defualt: "" },
        username: { type: String, default: "" },
        content: { type: String, default: "" },
      },
    ],
  })
);
