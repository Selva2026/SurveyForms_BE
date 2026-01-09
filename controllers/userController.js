import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All Fields Required" });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({ message: "User Already Exist" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
    });

    await newUser.save();

    res.json({
      message: "User Registered Successfully",
      newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id }, // 🔥 MUST be "id"
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token , username : user.name });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
