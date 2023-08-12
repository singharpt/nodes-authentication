// Get the necessary client details
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// get the JWT secret key from the .env file
const secretKey = process.env.JWT_SECRET_KEY;

// This function handles user registration
exports.register = async (req, res) => {
  // Get the request body paramaters
  const { email, password } = req.body;

  // Check if parameter are available
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are empty" });
  }

  // Create a variable to hold the data of the user if user exists
  let checkUser = null;

  //Check if the user already exists
  try {
    checkUser = await prisma.users_data.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.log("Error in looking for email");
  }

  //If the user does not exist
  if (checkUser === null) {
    try {
      // Hash the password and create a new record in the db
      bcrypt.hash(password, 10).then(async (hash) => {
        // specify the maxAge of the JWT token
        const maxAge = 3 * 60 * 60;

        // create the token using email, hashed password, secretKey
        const token = jwt.sign(
          {
            email,
            hash,
          },
          secretKey,
          {
            expiresIn: maxAge,
          }
        );

        console.log(token);

        // send this token as a cookie to the user
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });

        const response = await prisma.users_data.create({
          data: {
            email,
            password: hash,
          },
        });
        return res.status(200).json({ message: "User created successfully" });
      });
    } catch (err) {
      console.log("Error in user creation:", err);
      return res.status(400).json({ message: "User not created, try again" });
    }
  } else {
    console.log(checkUser);
    return res.status(400).json({ message: "User already exists" });
  }
};

// This function handles user login
exports.login = async (req, res) => {
  // Get the request body params
  const { email, password } = req.body;

  // If the email, password are unudefined return 400
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email or password" });
  }

  // Create a variable to hold the data of the user if user exists
  let checkUser = null;

  //Check if the user already exists
  try {
    checkUser = await prisma.users_data.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.log("Error in looking for email");
  }

  // If the user does not exists - return
  if (checkUser === null) {
    return res
      .status(400)
      .json({ message: "User not found, please register first" });
  } else {
    // Compare the text password with hash password
    bcrypt.compare(password, checkUser.password).then((result) => {
      if (result) {
        // specify the maxAge of the JWT token
        const maxAge = 3 * 60 * 60;

        // create the token using email, hashed password, secretKey
        const token = jwt.sign(
          {
            email,
            hash: checkUser.password,
            role: checkUser.admin,
          },
          secretKey,
          {
            expiresIn: maxAge,
          }
        );

        console.log(token);

        // send this token as a cookie to the user
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });

        // return status 200
        return res.status(200).json({ message: "User successfully loged in!" });
      } else {
        return res
          .status(400)
          .json({ message: "User found, but password is incorrect" });
      }
    });
  }
};

// This function handles user update
exports.update = async (req, res) => {
  // Get the request body params
  const { email, admin } = req.body;

  // Check if parameter are available
  console.log(email, admin);
  if (!email || !admin) {
    return res.status(400).json({ message: "Email and Admin are empty" });
  }

  // Create a variable to hold the data of the user if user exists
  let checkUser = null;

  //Check if the user already exists
  try {
    checkUser = await prisma.users_data.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.log("Error in looking for the user");
  }

  // If the user already exists
  if (checkUser !== null) {
    try {
      const response = await prisma.users_data.update({
        where: {
          email,
        },
        data: { admin: Boolean(admin) },
      });
      if (response) {
        return res
          .status(201)
          .json({ message: "The role of the user has been updated" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Error in modifying the role of the user" });
    }
  } else {
    return res.status(400).json({ message: "User not found" });
  }
};

// This function handles user deletion
exports.deleteUser = async (req, res) => {
  // Get the request body params
  const { email } = req.body;

  // Check if parameter are available
  if (!email) {
    return res.status(400).json({ message: "Email is empty" });
  }

  // Create a variable to hold the data of the user if user exists
  let checkUser = null;

  //Check if the user already exists
  try {
    checkUser = await prisma.users_data.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.log("Error in looking for the user");
  }

  // If the user already exists
  if (checkUser !== null) {
    try {
      const response = await prisma.users_data.delete({
        where: {
          email,
        },
      });
      if (response) {
        return res.status(201).json({ message: "The user has been deleted" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Error in deleting the user" });
    }
  } else {
    return res.status(400).json({ message: "User not found" });
  }
};
