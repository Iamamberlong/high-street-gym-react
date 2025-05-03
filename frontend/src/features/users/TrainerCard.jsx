import React from 'react'

function TrainerCard({ trainerName, description, photoUrl }) {

  return (
    <div className="card w-full bg-base-100 shadow-xl mb-4 bg-slate-100">
      <div className="card-body flex items-center">
        <img
          src={photoUrl}
          alt={`${trainerName}'s photo`}
          className="w-40 h-40 rounded-full border-2 border-blue-500 object-cover mr-4"
        />
        <div>
          <h2 className="card-title text-xl font-bold mb-2">{trainerName}</h2>
          <p className="text-gray-700 mb-2">{description}</p>
         
        </div>
      </div>
    </div>
  )
}

export default TrainerCard
