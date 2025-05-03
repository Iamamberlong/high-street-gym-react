import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"
import activityController from "./controllers/activities.js"
import classController from "./controllers/classes.js"
import bookingController from "./controllers/bookings.js"
import userController from "./controllers/users.js"
import blogController from "./controllers/blogs.js"
import locationController from "./controllers/locations.js"
import trainerController from "./controllers/trainers.js"
import auth from "./middleware/auth.js"
import path from "path"
import { fileURLToPath } from "url"


// Create express application
const port = 8080
const app = express()

// Enable cross-origin resources sharing (CORS)
app.use(cors({
    // Allow all origins
    origin: true,
}))



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log("dirname is: ", __dirname)
app.use("/images", express.static(path.join(__dirname, '../public/images')))
console.log("file names are: ", path.join(__dirname, '../public/images'))
// Enable JSON request parsing middleware. Must be done before endpoints are defined.
//
// If a request with a `Content-Type: application/json` header is
// made to a route, this middleware will treat the request body as
// a JSON string. It will attempt to parse it with `JSON.parse()`
// and set the resulting object (or array) on a `body` property of
// the request object, which you can access in your route endpoints,
// or other general middleware.
app.use(express.json())

// Enable file upload support
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))




// Import and use the route defined by controller.
app.use("/", locationController)
app.use("/", userController)
app.use("/", activityController)
app.use("/", classController)
app.use("/", bookingController)
app.use("/", blogController)
app.use("/", trainerController)

// have to edit /classes route in classController, because some of the routes I guess you applied
// /gymClasses

// https://prod.liveshare.vsengsaas.visualstudio.com/join?C7BEFB46D482AB0BAC2FED026B736FCC8DB6
// https://prod.liveshare.vsengsaas.visualstudio.com/join?C7BEFB46D482AB0BAC2FED026B736FCC8DB6
// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
})

// Start listening for API requests
app.listen(
    port,
    () => console.log(`Express started on http://localhost:${port}`),
)