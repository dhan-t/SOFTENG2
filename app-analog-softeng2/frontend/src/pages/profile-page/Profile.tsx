import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Profile.css";

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    profilePicture: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch user profile from the backend
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5001/api/user/${user}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      let profilePictureUrl = profile.profilePicture;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        const uploadResponse = await fetch("http://localhost:5001/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        profilePictureUrl = uploadData.imageUrl;
      }

      const response = await fetch(`http://localhost:5001/api/user/${user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...profile, profilePicture: profilePictureUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile updated:", data);
      refreshUser(); // Refresh user data after updating profile
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-form">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            name="birthday"
            value={profile.birthday}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="profile-picture-preview"
            />
          )}
        </label>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;