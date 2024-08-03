import { CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, logout } from "@/features/auth/authSlice";

const Topbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, isAuthenticated, user]);
  

  console.log(user);

  return (
    <section className="z-50 sticky top-0 flex w-full bg-black justify-between items-center py-3 px-8 border-b border-zinc-800">
      <Link to="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-2">
          <img alt="" src="/assets/logo.png" />
        </div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-white">
          SNIPPIFY
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <CircleUserRound size={32} color="white" />
        {user ? (
          <p className="text-white">{user.email}</p>
        ) : (
          <p className="text-white">Loading user details...</p>
        )}
        
      </div>
    </section>
  );
};

export default Topbar;
