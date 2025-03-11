const {
  signUpSchema,
  signInSchema,
  updatedUserScheme,
  userIdValidation,
} = require("../lib/validation/user");
const User = require("../models/user");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { setTokenCookie } = require("../lib/utils");

const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = signUpSchema.parse(
      req.body
    );
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "username already exists" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    if (!newUser) {
      return res.status(400).json({ message: "failed to create user " });
    }

    setTokenCookie(res, newUser, process.env.JWT_SECRET);

    return res.status(201).json({ message: "user created" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
const signIn = async (req, res) => {
  try {
    const { username, password } = signInSchema.parse(req.body);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "invalid username or password " });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "invalid username or password " });
    }

    setTokenCookie(res, user, process.env.JWT_SECRET);

    return res.status(200).json({ message: "user logged in" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "user signed out sucssefuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);

    const { fullName, username, email, password } = updatedUserScheme.parse(
      req.body
    );

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      const passwordMatch = await bcrypt.compare(password, userExists.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Check for unique username
    const usernameExists = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Check for unique email
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : userExists.password;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName ?? userExists.fullName,
        username: username ?? userExists.username,
        email: email ?? userExists.email,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("token");
    setTokenCookie(res, updatedUser, process.env.JWT_SECRET);
    await updatedUser.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const me = async (req, res) => {
  try {
    const { createdAt, email, fullName, username, _id, exp } = req.user;
    const user = {
      createdAt,
      email,
      fullName,
      username,
      id: _id,
      tokenExpired: exp,
    };
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  signUp,
  signIn,
  logOut,
  me,
};
