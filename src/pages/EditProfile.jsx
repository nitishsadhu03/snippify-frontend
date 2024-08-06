import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import Cropper from "react-easy-crop";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/utils/env";
import Topbar from "@/components/Topbar";
import Leftbar from "@/components/Leftbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { id } = useParams();
  const imageUrlRef = useRef(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [finalImageFile, setFinalImageFile] = useState(null);
  const [profileData, setProfileData] = useState({
    bio: "",
    tech_stack: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/${id}`);
        setProfileData(response.data);
        setCroppedImageUrl(response.data.image || "/assets/defaultProfile.png");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrlRef.current = reader.result;
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropChange = (crop) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleCroppedAreaClose = () => {
    setIsCropperOpen(false);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageUrlRef.current,
        croppedAreaPixels,
        200,
        200
      );
      const croppedImageFile = new File(
        [croppedImageBlob],
        "cropped-image.jpeg"
      );
      setCroppedImageUrl(URL.createObjectURL(croppedImageFile));
      setFinalImageFile(croppedImageFile);
      setIsCropperOpen(false);
    } catch (error) {
      console.error("Error cropping image", error);
    }
  };

  const getCroppedImg = async (imageSrc, crop, newWidth, newHeight) => {
    const image = new Image();
    image.src = imageSrc;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      newWidth,
      newHeight
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (finalImageFile) {
      formData.append("image", finalImageFile);
    }
    formData.append("bio", profileData.bio);
    formData.append("tech_stack", JSON.stringify(profileData.tech_stack));

    try {
      await axios.patch(`${BACKEND_URL}/api/users/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      navigate("/profile")
    } catch (error) {
      console.error("Error saving profile image", error);
      toast.error("Error saving profile image");
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleTechStackChange = (e) => {
    setProfileData({
      ...profileData,
      tech_stack: e.target.value.split(",").map((tech) => tech.trim()),
    });
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
          <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 w-full">
            <div className="relative w-36 h-36">
              <img
                src={croppedImageUrl}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover"
              />
              <input
                type="file"
                name="banner"
                accept=".jpg,.jpeg,.png"
                required
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="absolute inset-0 bg-black/50 flex flex-col gap-1 items-center justify-center rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
              >
                <p className="font-semibold text-white">Upload Image</p>
                <UploadCloud className="text-white" />
              </label>
            </div>
            {isCropperOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-brightness-50 backdrop-blur">
                <div className="bg-white rounded-lg pt-14 pb-4 px-8 relative">
                  <div className="absolute top-1 right-2 m-2">
                    <Button
                      onClick={handleCroppedAreaClose}
                      className="text-black bg-transparent hover:bg-transparent"
                    >
                      <X />
                    </Button>
                  </div>
                  <div className="relative w-[50rem] h-[30rem] mx-auto">
                    <Cropper
                      image={imageUrlRef.current}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={handleCropChange}
                      onZoomChange={handleZoomChange}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      onClick={handleCropConfirm}
                      className="text-white px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full max-w-xl">
              
              <div className="mb-4">
                <label className="block text-white mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Tech Stack</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={profileData.tech_stack.join(", ")}
                  onChange={handleTechStackChange}
                  className="w-full px-3 py-2 rounded-md bg-zinc-800 text-white"
                  placeholder="Enter tech stack, separated by commas"
                />
              </div>
              <Button
                onClick={handleSave}
                className="text-white px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 mt-4"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </section>
  );
};

export default EditProfile;
