const userModel = require("../models/userModel.js");
const Users = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const { id, fullName, email } = await Users.findById(req.user.id);
  res.status(200).json({
    status: 200,
    user: { id, fullName, email },
  });
  // console.log(res.user);
};

const createUsers = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if ((fullName, email, password)) {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(password, salt);

      const newUser = await Users.create({
        fullName,
        email,
        password: hashedPass,
      });

      res.status(201).json({
        status: "success",
        newUser,
        token: generateToken(newUser.id),
        uid: newUser.id,
      });
    } else {
      throw new Error("Provide the necessary fields");
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = await req.body;
  const userExists = await userModel.findOne({ email: email });
  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    res.status(200).json({
      user: {
        email: userExists.email,
        fullName: userExists.fullName,
        id: userExists.id,
        token: generateToken(userExists._id),
      },
    });
  } else {
    res.status(404).json({
      status: "An Error Occurred",
    });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { getUsers, createUsers, loginUser };
