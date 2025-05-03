import React, { useState, useEffect } from 'react'
import TrainerCard from './TrainerCard'
import PageLayout from '../../common/PageLayout'

import * as Trainers from '../../api/trainers'

export default function TrainerListPage() {

    const [trainers, setTrainers] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTrainers() {
            try {
                const allTrainers = await Trainers.getAll()
                setTrainers(allTrainers)
                console.log("The trainers are: ", trainers )
              
            } catch (error) {
                console.error("Error get all trainers", error)
                setError("Failed to load trainers")
            } finally {
                setLoading(false)
            }
        }
        fetchTrainers()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error : {error}</div>
    }
    return (
        <PageLayout>
       
            <h1 className='text-2xl font-bold mb-4 text-center'>Our trainers</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-screen'>
                {trainers.map((trainer) => (
                    <TrainerCard 
                        key={trainer.id}
                        trainerName={`${trainer.firstname} ${trainer.lastname}`}
                        description={trainer.description}
                        photoUrl={`http://localhost:8080/images/${trainer.photo_url}`}
                    />
                ))}
            </div>

        </PageLayout>
    )
}