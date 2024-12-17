import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div
      className="-mt-6 relative bg-white"
      style={{ borderRadius: "50px 0 0 0" }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          borderRadius: "50px 0 0 0",
          background:
            "linear-gradient(to right,rgb(188, 219, 255),rgb(254, 255, 223))",
        }}
      ></div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between pr-14 items-center">
          <div className="flex flex-col pt-4 ml-44">
            <h1 className="text-3xl font-semibold">Profile</h1>
            <span className="text-gray-500">
              Update your photo and personal details
            </span>
          </div>
          <div>
            <button
              disabled={loading}
              className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            >
              {" "}
              {loading ? "Loading..." : "Update"}{" "}
            </button>
          </div>
        </div>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="relative border-4 border-white rounded-full bottom-28 left-10 shadow-2xl bg-red-200 h-32 w-32">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="w-full h-full rounded-full object-cover cursor-pointer"
          />
        </div>

        <p className="text-sm -mt-24 ml-12">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <div className="flex flex-col mt-12 gap-10 pl-44 pr-14 pb-10">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Username</span>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              id="username"
              className="border p-3 w-3/4 rounded-lg"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Email</span>
            <input
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              id="email"
              className="border p-3 w-3/4 rounded-lg"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Password</span>
            <input
              type="password"
              placeholder="password"
              id="password"
              className="border p-3 w-3/4 rounded-lg"
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
