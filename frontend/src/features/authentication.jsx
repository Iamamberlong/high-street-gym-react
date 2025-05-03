import { createContext, useContext, useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode"
import {
    login as apiLogin,
    logout as apiLogout,

} from "../api/users"

export const AuthenticationContext = createContext(null)

export function AuthenticationProvider({ router, children }) {
    const [authenticatedUser, setAuthenticatedUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("jwtToken")
            console.log("token in authentication is: ", token)
            if (token) {

                try {
                    const decodedUser = jwtDecode(token)
                    const now = Date.now() / 1000

                    if (decodedUser.exp < now) {
                        localStorage.removeItem("jwtToken")
                        setAuthenticatedUser(null)
                        router.navigate("/")
                    } else {
                        setAuthenticatedUser({...decodedUser, token })
                    }
                    
                } catch(error) {
                    console.error("Failed to fetch user")
                    localStorage.removeItem("jwtToken")
                    setAuthenticatedUser(null)
                    router.navigate("/")
                    }
            }
        }
        fetchUser() 
    }, [router])

    return (
        <AuthenticationContext.Provider value={[authenticatedUser, setAuthenticatedUser]}>
            {children}
        </AuthenticationContext.Provider>
    )
}

export function useAuthentication() {
    const [authenticatedUser, setAuthenticatedUser] = useContext(AuthenticationContext)
 
    async function login(email, password) {
        setAuthenticatedUser(null)
        try {
            const result = await apiLogin(email, password)
            if (result.user) {
                localStorage.setItem('jwtToken', result.user.token)
                console.log("Token stored in localStorage:", result.user.token)

                const decodedUser = jwtDecode(result.user.token)
                setAuthenticatedUser({ ...decodedUser, token: result.user.token })
                console.log("The decodedUser is: ", { ...decodedUser, token: result.user.token })

                return Promise.resolve(result.message)
            } else {
                return Promise.reject(result.message)
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async function logout() {
        const token = localStorage.getItem('jwtToken')
        localStorage.removeItem('jwtToken')
        if (authenticatedUser && token) {
            try {
                const result = await apiLogout(token)
                setAuthenticatedUser(null)
                return Promise.resolve(result.message)
            } catch (error) {
                return Promise.reject(error)
            }
        }
        setAuthenticatedUser(null)
    }

    async function refresh() {
        const token = localStorage.getItem('jwtToken')
        if (token) {
            try {
                const decodedUser = jwtDecode(token)
                setAuthenticatedUser({ ...decodedUser, token })
                console.log("User refreshed with token: ", { ...decodedUser, token })

                return Promise.resolve('User refreshed')
            } catch (error) {
                return Promise.reject('User must be authenticated')
            }
        } else {
            return Promise.reject('User must be authenticated')
        }
    }

    return [authenticatedUser, login, logout, refresh]
}
