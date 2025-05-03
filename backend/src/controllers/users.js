import { Router } from "express"
import bcrypt from "bcryptjs"
import express from "express"
import * as Users from "../models/users.js"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import auth from "../middleware/auth.js"


dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const userController = express.Router()

userController.get("/login", (req, res) => {
  res.json({ message: "Login page" })
})

userController.post("/login", async (req, res) => {
  const { email, password } = req.body
  
  try {
    const loggedUser = await Users.getByEmailAddress(email)
    // console.log("The logged user is:", loggedUser)
    if (bcrypt.compareSync(password, loggedUser.password)) {
      const token = jwt.sign(
        {
          userID: loggedUser.id,
          role: loggedUser.role,
          firstName: loggedUser.firstname,
          lastName: loggedUser.lastname,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      )

      const userWithToken = {
        id: loggedUser.id,
        role: loggedUser.role,
        firstName: loggedUser.firstname,
        token: token,
      }

      res.json({ message: "Login Successful", user: userWithToken, token })
    } else {
      res.status(400).json({ message: "Invalid password" })
    }
  } catch (error) {
    res.status(404).json({ message: "User not found", error })
  }
})

// Route to render signup page (for testing or redirection purposes)
userController.get("/register", (req, res) => {
  res.json({ message: "Signup page" })
})

userController.post("/register", async (req, res) => {
  const formData = req.body
  const {
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
    unitNumber,
    streetNumber,
    streetName,
    streetType,
    suburb,
    postcode,
  } = formData

  console.log("formData is: ", formData)

  // Validate inputs
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" })
  }

  if (
    !validator.isLength(password, { min: 6 }) ||
    !validator.isAlphanumeric(password)
  ) {
    return res.status(400).json({ message: "Invalid password" })
  }

  if (!/^04\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number" })
  }

  if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    return res.status(400).json({ message: "Names must be letters" })
  }

  if (!validator.isNumeric(streetNumber) || !validator.isNumeric(postcode)) {
    return res
      .status(400)
      .json({ message: "Street number and post code must be numbers" })
  }

  const address = `${
    unitNumber ? `Unit ${unitNumber}, ` : ""
  }${streetNumber} ${streetName} ${streetType}, ${suburb}, ${postcode}`

  const newUser = Users.newUser(
    null,
    validator.escape(email),
    bcrypt.hashSync(password, 10),
    "member",
    validator.escape(phoneNumber),
    validator.escape(firstName),
    validator.escape(lastName),
    validator.escape(address)
  )

  try {
    // Check if the email already exists
    try {
      await Users.getByEmailAddress(email)
      // If the code reaches here, it means the email already exists
      return res.status(400).json({
        status: 400,
        message: "Email already exists!",
      })
    } catch (emailError) {
      // Email does not exist, continue to check phone number
      if (emailError !== "Email does not exist.") {
        // If the error is not about email not existing, handle it
        throw emailError
      }
    }

    // Check if the phone number already exists
    try {
      await Users.getByPhone(phoneNumber)
      // If the code reaches here, it means the phone number already exists
      return res.status(400).json({
        status: 400,
        message: "Phone number already exists!!!",
      })
    } catch (phoneError) {
      // Phone number does not exist, proceed to create the user
      if (phoneError !== "Phone does not exist.") {
        // If the error is not about phone not existing, handle it
        throw phoneError
      }
    }

    // Create the new user if both email and phone number are unique
    const [result] = await Users.create(newUser)
    res.status(201).json({
      status: 201,
      message: "Signup successful",
      userId: result.insertId,
    })
  } catch (error) {
    console.error("Error during registration: ", error)
    return res.status(500).json({
      status: 500,
      message: "Error during registration",
      error,
    })
  }
})

// any role can change the info of any users.
// restrict a logged in user to only modify their own profile, but allow admin to modify others. 
// if the id of the logged in person is the same as the one who is making the patch request. 
// Update user route
userController.patch(
  "/my-profile",
  auth(["admin", "member", "trainer"]),
  async (req, res) => {
    const decodedUserID = req.user.userID 
    const decodedUserRole = req.user.role
    const formData = req.body

    const {
      userID,
      email,
      password,
      phone,
      firstname,
      lastname,
      unitNumber,
      streetNumber,
      streetName,
      streetType,
      suburb,
      postcode,
    } = formData

    console.log("userID from frontend is: ", userID)
    if (decodedUserID != userID && decodedUserRole != "admin") {
      return res.status(403).json({
        status: 403,
        message: "Permission denied."
      })
    }

    console.log("formData sent from frontend: ", formData)

    // Validate inputs
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" })
    }

    if (password && !validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: "Invalid password" })
    }

    if (phone && !/^04\d{8}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" })
    }

    if (
      (firstname && !validator.isAlpha(firstname)) ||
      (lastname && !validator.isAlpha(lastname))
    ) {
      return res.status(400).json({ message: "Names must be letters" })
    }

    if (
      (streetNumber && !validator.isNumeric(streetNumber)) ||
      (postcode && !validator.isNumeric(postcode))
    ) {
      return res
        .status(400)
        .json({ message: "Street number and post code must be numbers" })
    }

    const address = `${
      unitNumber ? `Unit ${unitNumber}, ` : ""
    }${streetNumber} ${streetName} ${streetType}, ${suburb}, ${postcode}`

    const existingUser = await Users.getById(userID)
    console.log("the user to be updated is: ", existingUser)
    const userRole = existingUser.role
    // const updatedUserData = Users.newUser(
    //   userID,
    //   validator.escape(email),
    //   password ? bcrypt.hashSync(password, 10) : existingUser.password,
    //   userRole,
    //   validator.escape(phone),
    //   validator.escape(firstname),
    //   validator.escape(lastname),
    //   validator.escape(address)
    // )

    const updatedUserData = {
      id: userID,
      email: email ? validator.escape(email) : existingUser.email,
      password: password ? bcrypt.hashSync(password, 10) : existingUser.password,
      role: userRole ? userRole: 'member',
      phone: phone ? validator.escape(phone) : existingUser.phone,
      firstname: firstname ? validator.escape(firstname) : existingUser.firstname,
      lastname: lastname ? validator.escape(lastname) : existingUser.lastname,
      address: address ? validator.escape(address) : existingUser.address
    };

    console.log("updatedData is: ", updatedUserData)

    try {
    
      const [result] = await Users.update(updatedUserData)
      console.log("update result  is: ", result)

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        status: 200,
        message: "Update successful",
        userID: userID,
        data: updatedUserData
      })

    } catch (error) {
      res.status(500).json({ message: error.message, error })
    }
  }
)

userController.get(
  "/my-profile",
  auth(["admin", "trainer", "member"]),
  async (req, res) => {
    try {
      const userID = req.user.userID
      const user = await Users.getById(userID)
      console.log("The specific user  is:::", user)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const { password, ...userWithoutPassword } = user
      console.log("user without password: ", userWithoutPassword)
      res.status(200).json({
        status: 200,
        message: "User is found",
        accessRole: req.user.role,
        firstName: req.user.firstName,
        user: userWithoutPassword,
      })
    } catch (error) {
      res.status(500).json({ message: "Server error", error })
    }
  }
)


export default userController
