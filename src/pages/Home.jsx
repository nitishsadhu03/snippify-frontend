import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout, reset } from '../features/auth/authSlice'


const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }


    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-6xl" >Welcome, {userInfo.name} </h1>
            <button className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600" type="submit" onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home