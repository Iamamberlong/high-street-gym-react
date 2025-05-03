import React, { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function LocationCard({ name, address, contactNumber }) {
  const [coordinates, setCoordinates] = useState([-27.443670, 152.994263])
  const mapRef = useRef(null)

  useEffect(() => {
    async function fetchCoordinates() {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
        const data = await response.json()
        if (data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch (error) {
        console.error('Error fetching coordinates: ', error)
      }
    }
    fetchCoordinates()
  }, [address])

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current, {
        center: coordinates,
        zoom: 13,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      L.marker(coordinates).addTo(map)
        .bindPopup(`<b>${name}</b><br>${address}<br>Phone: ${contactNumber}`)
        .openPopup()

      return () => {
        map.remove()
      }
    }
  }, [coordinates, name, address, contactNumber])

  return (
    <div className="bg-gray rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-600 mb-2">{address}</p>
        <p className="text-gray-600">Phone: {contactNumber}</p>
      </div>
      <div ref={mapRef} className="h-64 w-full" id="map"></div>
    </div>
  )
}

export default LocationCard
