const mongoose = require("mongoose");

const connection = mongoose
  .connect("mongodb://localhost/hikma", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  department: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  access: {
    site: {
      type: String,
      default: "iab",
    },
    type: {
      type: String,
      default: "user",
    },
  },
});

const User = mongoose.model("User", UserSchema);

// Expose the connection
module.exports = User;
