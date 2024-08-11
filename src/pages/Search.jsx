import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/env";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";

const Search = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  
  
  useEffect(() => {
    if(!accessToken) {
      console.log(!accessToken)
      navigate("/")
    }

  }, []);
  

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/`);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      inputRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white w-[84%] h-screen mt-14 py-9 px-8">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />
        <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
          <h1 className="text-2xl font-bold">Search Users</h1>
          <div className="relative">
            <div
              className="absolute top-1 left-1 flex items-center h-full translate-x-2 cursor-pointer"
              onClick={handleToggleExpand}
            >
              <SearchIcon size={26} color="white" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name"
              onFocus={handleToggleExpand}
              onBlur={handleToggleExpand}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`transition-all duration-300 px-5 py-3  mt-4 mb-2 rounded-lg bg-zinc-800 text-white ${
                isExpanded
                  ? "w-2/3 pl-14 pr-4 border border-gray-600"
                  : "w-1/2 pl-14 pr-4 border-none"
              } focus:outline-none`}
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="mt-3">No users found</p>
          ) : (
            <div className="my-8 flex flex-col gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-zinc-800 px-4 py-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={user.image || "/assets/defaultProfile.png"}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-lg font-semibold capitalize">
                      {user.user.name}
                    </p>
                  </div>
                  <Link to={`/view-profile/${user.id}`}>
                    <Button className="bg-rose-600 hover:bg-rose-500 text-center font-semibold">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Search;
