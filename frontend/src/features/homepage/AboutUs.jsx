import React from "react"
import { FaHistory, FaUsers, FaHeartbeat } from "react-icons/fa" // Example icons

const AboutUs = () => {
  return (
    <section className="about-us py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white-800 mb-4">
            About Us
          </h2>
          <p className="text-lg text-gray-600">
            Discover who we are, what drives us, and how we're dedicated to
            making your fitness journey exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-gray bg-slate-100 shadow-md rounded-lg">
            <FaHeartbeat className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <div className="text-left">
              <p className="text-gray-700">
                At High Street Gym, our mission is to inspire and support our
                members in achieving their fitness goals through personalized
                training, state-of-the-art facilities, and a welcoming
                community.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-100 shadow-md rounded-lg">
            <FaHistory className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our History</h3>
            <div className="text-left">
              <p className="text-gray-700">
                Established in 2005, High Street Gym has grown from a small
                local fitness center into a leading gym with a strong reputation
                for quality and innovation in fitness training.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-100 shadow-md rounded-lg">
            <FaUsers className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Community</h3>
            <div className="text-left">
              <p className="text-gray-700">
                Join a vibrant community of fitness enthusiasts, from beginners
                to advanced athletes. Our diverse range of classes and
                supportive environment ensure you feel welcome and motivated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
