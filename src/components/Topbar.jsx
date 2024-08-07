import { CircleUserRound, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, logout } from "@/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URL } from "@/utils/env";
import axios from "axios";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/users/${user.id}/`
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user !== null) {
      fetchProfileData();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const profileImageUrl = profileData?.image || "/assets/defaultProfile.png";

  return (
    <section className="z-50 sticky top-0 flex w-full bg-black justify-between items-center py-3 px-8 border-b border-zinc-800">
      <Link to="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-2">
          <img alt="logo" src="/assets/logo.png" />
        </div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-white">
          SNIPPIFY
        </h1>
      </Link>
      {loading ? (
        <p className="text-white">Loading user details...</p>
      ) : (
        user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none cursor-pointer">
              <img
                src={profileImageUrl}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 text-white border-none mr-14">
              <DropdownMenuLabel className="font-semibold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/profile" className="flex gap-1 text-md items-center">
                  <User size={17} />
                  <p>Profile</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={handleLogout}>
                <LogOut size={17} />
                <p>Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
    </section>
  );
};

export default Topbar;
