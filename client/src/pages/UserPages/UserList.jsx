import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from 'react';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';
import { Link } from "react-router-dom";
import { FaTasks ,FaPlusCircle, FaRegCreditCard, FaTrash, FaEdit, FaInfoCircle } from "react-icons/fa";

export default function UserList() {
  const fileRef = useRef(null);
  const {currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

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
      'state_changed',
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
  

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  useEffect(() => {
    // Gọi hàm handleShowListings khi trang được mở
    handleShowListings();
  }, []);

  const silverCardCount = 3; // Thay thế bằng số lượng thực tế của thẻ bạc
  const goldCardCount = 2;

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" max-w-full mx-auto bg-slate-100 shadow-md rounded-lg p-3"> {/* Increased padding */}
      <div>
        <div className = "text-4xl flex justify-center items-start text-center gap-2">
              <FaTasks></FaTasks> Your Property List
            </div>
        <hr className="border-gray-300 my-4" />
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-xl font-medium">
                {currentUser.silverCard}
              </span>
              <FaRegCreditCard className="text-gray-500 text-2xl" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-700 text-xl font-medium">
                {currentUser.goldCard}
              </span>
              <FaRegCreditCard className="text-yellow-500 text-2xl" />
            </div>
            <Link to ="/settings/store" className="rounded-lg" > <FaPlusCircle /> </Link>
          </div> 
        
        
        
        
    
        <div className="flex items-center gap-4">
        {/* Nút Create */}
        
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-lg uppercase text-center hover:opacity-90 text-sm font-medium"
          onClick = {handleOpen}
        >
          Create
        </button>
        
      </div>
      </div>
      <p className="text-red-700 mt-5 text-lg">
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      </div>
      {userListings && userListings.length > 0 && !currentUser.isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-7">
           {/* Larger title */}
          {userListings.map((listing) => (
            <div
              key={listing._id}
              onClick = {() => (console.log(listing))}
              className="w-full shadow-slate-500 shadow-md border rounded-lg p-5 flex justify-between items-center gap-6"
            >
              
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-36 w-36 object-contain"
                  />
                  </Link>
                  <div className="flex flex-col items-center justify-center gap-y-2">
                    <Link
                      className="text-slate-700 font-semibold hover:underline truncate flex-1 text-xl"
                      to={`/listing/${listing._id}`}
                    >
                      <p className="text-3xl">{listing.name}</p>
                    </Link>
                    <d>
                          Status:{" "}
                          <span
                            className={`${
                              listing.status === "Approved"
                                ? "text-green-500"
                                : listing.status === "Pending"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {listing.status}
                          </span>
                        </d>
                  </div>
           
  
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase text-lg font-semibold flex items-center justify-center"
                >
                  <FaTrash/>  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase text-lg font-semibold flex items-center justify-center">
                    <FaEdit/> Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          {/* Close button at the top-right */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
            onClick={handleClose}
          >
            &times;
          </button>
  
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4 text-center">Choose Create Property Type</h2>
  
          {/* Buttons for options */}
          <p className="mb-4 items-start gap-2 flex"> 
            Note: Listing created by Premium Card will offer more features than normal one. Also you can't create Property that value over 40 000$ without Premium Card
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              className="items-center justify-center text-center w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              to='/create-listing'
            >
              Normal Create
            </Link>
            <Link
              className="w-full text-center bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
              to='/create-listing-premium'
            >
              Premium Create
            </Link>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}