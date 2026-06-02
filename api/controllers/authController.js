import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Joi from "joi";

// ---------- Validation Schemas ----------
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .message(
      "Password must contain at least one uppercase, one lowercase, one number and one special character",
    )
    .required(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .message("Phone must be in E.164 format (e.g., +1234567890)")
    .required(),
  role: Joi.string().valid("USER", "OWNER").required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ---------- Helper: Format user response ----------
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// ---------- Controllers ----------
export const register = async (req, res) => {
  try {
    // Validate request body
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, phone, role } = req.body;

    // Attempt to create user – rely on unique index for duplicate detection
    const user = await User.create({ name, email, password, phone, role });

    // Generate token and set secure HTTP‑only cookie
    generateToken(res, user._id);

    res.status(201).json(formatUserResponse(user));
  } catch (error) {
    // Handle duplicate email (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    // Validate login input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json(formatUserResponse(user));
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
