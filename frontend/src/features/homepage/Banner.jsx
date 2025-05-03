import React from 'react'
import { useNavigate } from 'react-router-dom'
import bannerPic from '../../assets/gym-banner-pic.jpg' 

const Banner = () => {
    const navigate = useNavigate()

    return (
        <section 
            className="relative bg-cover bg-center h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center"
            style={{ backgroundImage: `url(${bannerPic})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to High Street Gym</h1>
                <p className="mb-4 text-center text-sm md:text-base">Join us to achieve your fitness goals!</p>
                <button 
                    className="btn btn-primary bg-blue-500 w-40 h-20 text-3xl text-white px-6 py-3 md:text-base" 
                    onClick={() => navigate('/register')}
                >
                    Join Us
                </button>
            </div>
        </section>
    )
}

export default Banner
