import Leftbar from "@/components/Leftbar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  console.log(users);

//   const viewProfile = (id) => {
//     navigate(`/profile/${id}`)
//   }

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar />
        <div className="text-white w-[84%] h-full min-h-screen mt-4 py-9 px-8 bg-black">
          <h1 className="text-2xl font-bold">Search Users</h1>

          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <div className="my-8 flex flex-col gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-zinc-800 px-4 py-3 rounded-xl flex items-center justify-between">
                <div className="flex gap-4 items-center">
                <img src={user.image || "/assets/defaultProfile.png"} alt="profile"
                  className="w-12 h-12 rounded-full object-cover"/>
                  <p className="text-lg font-semibold capitalize">{user.user.name}</p>

                </div>
                  <Button className="bg-rose-600 hover:bg-rose-500 text-center font-semibold" >View</Button>
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
