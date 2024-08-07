// Activation.js
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import { useState } from "react";

const Activation = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleActivate = async () => {
    setSubmitting(true);
    const activationData = {
      uid,
      token,
    };
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/users/activation/`,
        activationData
      );
      setSubmitting(false);
      toast.success("Account Activated");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-10 h-screen mx-10">
        <img
          src="/assets/acctivationImg.png"
          alt="image"
          className="px-6 w-[90%] h-[40%] sm:w-[50%] sm:h-[70%]"
          style={{ filter: "drop-shadow(6px 10px 13px gray)" }}
        />
        <div className="flex flex-col justify-center items-center gap-10 w-[40%] mx-10">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-5xl text-center">
            ACCOUNT ACTIVATION
          </h1>
          <p className="text-white text-sm sm:text-lg text-center">
            Click the button below to activate and your account and unlock
            unlimited features on Snippify!
          </p>
          {submitting ? (
            <Button
              className="rounded-full mt-10 bg-rose-600 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              disabled={submitting}
            >
              Loading...
            </Button>
          ) : (
            <Button
              className="rounded-full mt-10 bg-rose-600 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              type="submit"
              onClick={handleActivate}
            >
              Activate account
            </Button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Activation;
