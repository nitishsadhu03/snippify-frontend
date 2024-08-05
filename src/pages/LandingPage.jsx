import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LandingPage = () => {
  return (
    <div className="bg-black h-full">
      <Navbar/>
      <Hero/>
      <ToastContainer/>
    </div>
  )
}

export default LandingPage