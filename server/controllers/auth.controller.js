import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { config } from '../config/config.js'

//signup
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
   // Check if the email already exists
   const existingUser = await User.findOne({ email: { $eq: req.body.email } });
   if (existingUser) {
    return next(errorHandler(400, "Email already exists"))
   }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully !" });
  } catch (err) {
    next(err);
  }
};

//signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: { $eq: email } });
    if (!validUser) return next(errorHandler(404, "user not found !"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(403, "wrong credentials !"));
    const token = jwt.sign({ id: validUser._id }, config.JWT_SECRET);
    //seperate password from the rest of the user's data(not to be sent to the client again.because its not safe)
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // cookie for one hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};