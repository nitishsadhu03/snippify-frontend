import { Link, NavLink } from "react-router-dom"
import { Button } from "./ui/button"

const Navbar = () => {


  return (
    <nav className="flex justify-between items-center px-6 py-5 border-b-2 border-b-zinc-800 sticky top-0 backdrop-filter backdrop-blur-xl">
        <Link to="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-2">
          <img alt="" src="/assets/logo.png"/>
        </div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-white">SNIPPIFY</h1>
      </Link>
    <div className="lg:flex gap-x-8 items-center hidden">
        <NavLink to="/"><p className="text-xl px-3 text-white cursor-pointer">Home</p></NavLink>
        <NavLink to="/"><p className="text-xl px-3 text-white cursor-pointer">Features</p></NavLink>
        <NavLink to="/"><p className="text-xl px-3 text-white cursor-pointer">View Illustrations</p></NavLink>
        <NavLink to="/"><p className="text-xl px-3 text-white cursor-pointer">Our Team</p></NavLink>
      </div>
      <div className="flex gap-x-5">
        <Link to="/login">
            <Button className="border-2 border-white text-white text-lg hover:bg-white hover:text-black">Login</Button>
        </Link>
        <Link to="/register">
            <Button className="bg-white text-black text-lg hover:bg-black hover:text-white hover:border-2 hover:border-white">Register</Button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar