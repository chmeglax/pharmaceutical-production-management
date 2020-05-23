const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
/*equipmentSchema.index({ name: "text", subscribedToChannel: "text" });
equipmentSchema.index({ "$**": "text" });*/
module.exports = mongoose.model("MEDICEFProducts", productSchema);
