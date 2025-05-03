import { Link, useNavigate } from "react-router-dom"
import { useAuthentication } from "../features/authentication"
import logo from "../assets/logo-no-background.png"
import { useEffect, useState } from "react"
import LogoutButton from "./LogoutButton"


export default function Nav() {
  const [user, login, logout] = useAuthentication();
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function fetchUserData() {
  //     setLoading(true)
  //     try {
  //       if (user) {
  //         const updatedUser = await getUserById(user.userID)
  //         setUserData(updatedUser)
  //       }
  //     } catch (err) {
  //       setError(err)
  //     }
  //   }
  //   fetchUserData()
  // }, [user])

  function onLogoutClick(e) {
    e.preventDefault()
    logout()
    navigate("/")
  }

  return (
    <div className="w-full flex flex-col justify-between bg-blue-500 text-white py-4 items-center md:flex-row md:items-baseline">
      <div className="navbar flex md:justify-start">
        <ul className="menu md:menu-horizontal px-1 w-full text-lg">
     
          <li>
            <Link to="/activities">Activities</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/classes">Classes</Link>
          </li>
      
          <li>
            <a href="/locations">Locations</a>
          </li>

          <li>
            <a href="/trainers">Trainers</a>
          </li>


          {user && (
            <>
              
              {/* <li className="text-yellow-300">
                Hello, {userData.firstname}!
              </li> */}
          
              <li>
              <Link to="/my-profile">My Profile</Link>
              </li>

              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/create-class">Create Class</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {user.role === "trainer" && (
                <>
                  <li>
                    <Link to='/classes/my-classes'>My Classes</Link>
                  </li>

                  <li>
                    <Link to="/create-class">Create Class</Link>
                  </li>

                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {user.role === "member" && (
                <>
                  <li>
                    <Link to="/my-bookings">My Bookings</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
     
              <li>
               <LogoutButton />
              </li>
            </>
          )}

          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
