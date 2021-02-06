const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail, OTP } = require("../sender/mail.js");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    otp: {
      type: Number,
    },
    otp_verified: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.otp_verified;
  delete userObject.otp;

  return userObject;
};

//Error While Duplicate values
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error(`${Object.keys(error.keyPattern)} already exists`));
  } else {
    next();
  }
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); // Add JsonWebToken Secret

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("No User Found Please SignUp!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password Is InCorrect");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//1 Get User In Forget Password
userSchema.statics.getUser = async (body) => {
  let user;
  if (body.email.length > 0) {
    user = await User.findOne({
      email: body.email,
    });
    if (!user) {
      throw new Error("No user Found Please Signup!");
    }
    user.otp = null;
    user.otp_verified = false;
    await sendMail(user);
    user.otp = OTP;
    await user.save();
    return user;
  }
};

//2 verify Otp
userSchema.statics.verifyOtp = async (body) => {
  let user;
  if (body.email.length > 0) {
    user = await User.findOne({ email: body.email });
  }
  if (user.otp === null) {
    throw new Error("Otp Expired!");
  }
  if (user.otp != body.otp) {
    throw new Error("Please Enter Valid OTP");
  }
  user.otp_verified = true;
  await user.save();
  return user;
};

//3 Reset Password
userSchema.statics.resetPassword = async (body) => {
  let user;
  if (body.email.length > 0) {
    user = await User.findOne({ email: body.email });
  }
  if (user.otp_verified != true) {
    throw new Error("Please Verify Your Email");
  }
  user.password = body.password;
  user.otp = null;
  user.otp_verified = false;
  user.tokens = [];
  await user.save();
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
