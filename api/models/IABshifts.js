const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  number: {
    type: String,
    required: true,
  },

  first: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  second: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },
  third: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },
});

shiftSchema.query.new = function () {
  return this.sort({ _id: -1 });
};
/*equipmentSchema.index({ name: "text", subscribedToChannel: "text" });
equipmentSchema.index({ "$**": "text" });*/
module.exports = mongoose.model("IABshifts", shiftSchema);
