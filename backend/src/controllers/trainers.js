import express from "express" 
import * as Trainers from "../models/trainer-users.js" 


const trainerController = express.Router()

trainerController.get("/trainers", async (req, res) => {
    try {
        const trainers = await Trainers.getAll()
        console.log("all the trainers are: ", trainers)
        res.status(200).json({
            status: 200,
            message: "Get all trainers",
            trainers: trainers
        })
        console.log("trainers are: ", trainers)
    } catch (error) {
        console.error("Error fetching trainers:", error)
        res.status(500).json({ 
            status: 500,
            message: "Failed to fetch trainers",
            error: error.message
        })
    }
})


export default trainerController