import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosClient from "@/lib/axios-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setselectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`)
    }

  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required!");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required!");
      return false;
    }
    return true;
  }
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await axiosClient.post(UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.data.success) {
          setUserInfo(response.data.user);
          toast.success("Profile update successfully!");
          navigate("/chat");
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    }
    else {
      toast.error("Please setup profile!");
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await axiosClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.data.success) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image Update Successfully");
      }

    }
  }

  const handleDeleteImage = async () => {
    try {
      const response = await axiosClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });


      if (response.data.success) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully!");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage src={image} alt="Profile" className="object-cover h-full w-full bg-black" />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl 
                border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered &&
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ?
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                  :
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                }
              </div>
            }
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .webp, .svg" />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setfirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                ${selectedColor === index ? "outline outline-white outline-1" : ""
                  }`}
                  key={index}
                  onClick={() => setselectedColor(index)}
                >

                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges} >Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile;
