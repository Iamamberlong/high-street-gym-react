import express from "express"
import * as Locations from "../models/locations.js"
import { body, param, validationResult} from "express-validator"
import xml2js from "xml2js"
import auth from "../middleware/auth.js"

const locationController = express.Router()

// #1 Route to get all locations
locationController.get("/locations", async (req, res) => {
    const locations = await Locations.getAll()

    console.log("locations are: ", locations)

    res.status(200).json({
        status: 200,
        message: "Get all locations",
        locations: locations,
    })
})

// #2 get by id
locationController.get(
    "/locations/:id", 
    param("id").isInt().withMessage("Location ID must be an integer"),
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const locationID = req.params.id

        Locations.getByID(locationID)
            .then(location => {
                res.status(200).json({
                    status: 200,
                    message: "Get location by ID",
                    location: location
                })
            })
            .catch(error => {
                res.status(500).json({
                status: 500,
                message: "Failed to get location by ID"
                })
            }) 
    }
)

// #3 Uploading xml file
const validateLocationXML = (data) => {
    // Check if the root element <location-upload> exists
    const locationUpload = data["location-upload"]
    if (!locationUpload) {
        return "Missing root element <location-upload>."
    }

    // Check if the "operation" attribute exists and is either "insert" or "update"
    const locationUploadAttributes = locationUpload["$"]
    const operation = locationUploadAttributes?.["operation"]
    if (!operation || (operation !== "insert" && operation !== "update")) {
        return "Invalid or missing 'operation' attribute. Must be 'insert' or 'update'."
    }

    // Check if the <locations> array exists
    const locationsData = locationUpload["locations"]?.[0]?.["location"]
    if (!locationsData || locationsData.length === 0) {
        return "The <locations> element is missing or empty."
    }

    // Ensure each location has a name, address, and phone
    for (const location of locationsData) {
        if (!location.name || !location.address || !location.phone) {
            return "Each <location> must contain <name>, <address>, and <phone> elements."
        }
    }

    // If all checks passed, return null (no errors)
    return null
}

locationController.post("/locations/upload-xml", auth(["admin"]), (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser()
        parser.parseStringPromise(file_text)
            .then(data => {
                const validationError = validateLocationXML(data)
                if (validationError) {
                    return res.status(400).json({
                        status: 400,
                        message: "XML file is invalid, please provide a correctly structured XML file."
                    })
                }

                const locationUpload = data["location-upload"]
                const locationUploadAttributes = locationUpload["$"]
                const operation = locationUploadAttributes["operation"]
                const locationsData = locationUpload["locations"][0]["location"]

                console.log("locationsData looks like: ", locationsData)

                if (operation == "insert") {
                    Promise.all(locationsData.map((locationData) => {
                        // Convert the xml object into a model object
                        const locationModel = Locations.newLocation(null, locationData.name.toString(), locationData.address.toString(), locationData.phone.toString())
                        // Return the promise of each creation query
                        return Locations.create(locationModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload insert successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(locationsData.map((locationData) => {
                        // Convert the xml object into a model object
                        const locationModel = Locations.newLocation(
                            locationData.id.toString(),
                            locationData.name.toString(),
                            locationData.address.toString(),
                            locationData.phone.toString()
                        )
                        // Return the promise of each creation query
                        return Locations.update(locationModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload update successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })

                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML Contains invalid operation attribute value",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })


    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

export default locationController
