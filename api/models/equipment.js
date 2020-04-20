const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
/*equipmentSchema.index({ name: "text", subscribedToChannel: "text" });
equipmentSchema.index({ "$**": "text" });*/
module.exports = mongoose.model("Equipments", equipmentSchema);
