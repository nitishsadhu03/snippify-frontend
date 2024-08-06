import { logout } from "@/features/auth/authSlice";
import {
  BellRing,
  CircleUserRound,
  Home,
  LogOut,
  Search,
  SquarePen,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Leftbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="sticky top-16 bg-black z-40 text-white w-[16%] h-[46.5rem] flex flex-col justify-between py-10 pl-5 pr-1 items-start border-r border-zinc-800">
      <div className="flex flex-col gap-8 font-semibold">
        <Link
          to="/home"
          className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300"
        >
          <Home />
          <p className="text-xl cursor-pointer">Home</p>
        </Link>
        <Link
          to="/create-snippet"
          className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300"
        >
          <SquarePen />
          <p className="text-xl cursor-pointer">Create Snippet</p>
        </Link>
        <Link className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300">
          <BellRing />
          <p className="text-xl cursor-pointer">Activity</p>
        </Link>
        <Link to="/search" className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300">
          <Search />
          <p className="text-xl cursor-pointer">Search</p>
        </Link>
        <Link to="/profile" className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300">
          <CircleUserRound />
          <p className="text-xl cursor-pointer">Profile</p>
        </Link>
      </div>
      <div>
        <button onClick={handleLogout} className="flex gap-2 py-2 px-2 hover:bg-white hover:text-zinc-700 rounded-lg transition ease-in-out delay-150 hover:scale-110 duration-300">
          <LogOut />
          <p className="text-xl cursor-pointer font-semibold">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Leftbar;
