import { useEffect, useState } from "react" 
import * as GymClasses from "../../api/classes" 
import PageLayout from "../../common/PageLayout" 
import TrainerClassCard from "./TrainerClassCard" 
import { useAuthentication } from "../authentication" 
import { useNavigate } from "react-router-dom" 


export default function MyClassesPage() {
  const [myGymClasses, setMyGymClasses] = useState([])
  const [message, setMessage] = useState('')
  const [user] = useAuthentication() 
  const token = localStorage.getItem("jwtToken") 
  const navigate = useNavigate() 
  const userRole = user?.role || '' 
  const userID = user?.userID || ''


  useEffect(() => {
    const fetchGymClasses = async () => {
      if (user && token) {
        try {
          const response = await GymClasses.getMyClasses(token) 
          console.log("My classes are: ", response.data) 
          setMyGymClasses(response.data) 
          console.log("myGymClasses: ", response.data)
        } catch (error) {
          console.error("Error fetching my gymClasses: ", error) 
        }
      }
    } 
    fetchGymClasses() 
  }, [user, token]) 

  const handleDelete = async (gymClassId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this class?");
    if (confirmed) {
      try {
        await GymClasses.remove(gymClassId, token); 
        setMyGymClasses(myGymClasses.filter(gymClass => gymClass.id !==gymClassId)); 
        setMessage("Class successfully canceled.");
  
      } catch (error) {
        console.error("Error canceling class: ", error);
        setMessage("An error occurred while canceling the class.");
      }
    }
  };
  

  return (
    <PageLayout>

      <div className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">My Classes</h2>
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {myGymClasses.length > 0 ? (
            myGymClasses.map((gymClass) => (
              <TrainerClassCard
                key={gymClass.id}
                gymClass={gymClass}
                onDelete={handleDelete}
                userRole={userRole}
                userID={userID}
              />
            ))
          ) : (
            <div className="text-center">You have not created any classes yet.</div>
          )}
        </div>
      </div>

    </PageLayout>
  ) 
}



