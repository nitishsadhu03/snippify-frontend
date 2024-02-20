import axios from "axios";

const BASE_URL = "http://localhost:3000"

const REGISTER_URL = `${BASE_URL}/api/auth/users/`
const LOGIN_URL = `${BASE_URL}/api/auth/jwt/create/`
const ACTIVATE_URL = `${BASE_URL}/api/auth/users/activation/`
const GET_USER_INFO = `${BASE_URL}/api/auth/users/me/`


// Register user

const register = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)

    return response.data
}

// Login user

const login = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

// Logout 

const logout = () => {
    return localStorage.removeItem("user")
}

// Activate user

const activate = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)

    return response.data
}



// Get User Info

const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}



const authService = { register, login, logout, activate, getUserInfo }

export default authService