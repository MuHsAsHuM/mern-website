import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {  
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";

import { FaUserCircle, FaTasks , FaShoppingCart ,FaToolbox ,FaSignOutAlt  } from "react-icons/fa";

const UserSidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false); // State điều khiển việc mở/đóng menu con
  // Hàm toggle mở/đóng menu con
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-1/10 min-h-screen max-h-full bg-gray-800 text-white p-5 flex-col shadow-lg flex ">
      <ul className="flex flex-col  h-full space-y-3">
        <li>
          <Link
            to="/settings/user-profile" //chỉnh lại đường dẫn
            className={`font-bold text-lg flex py-3 pl-3 pr-1 rounded-lg ${
              location.pathname === "/settings/user-profile"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <FaUserCircle size = "35" className="mr-2" />
          </Link>
        </li>
        
        <li>
          <Link
            to="/settings/user-list" //chỉnh lại đường dẫn
            className={`font-bold text-lg flex py-3 pl-3 pr-1 rounded-lg ${
              location.pathname === "/settings/user-list"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <FaTasks size = "35" className="mr-2" />
          </Link>
        </li>

        <li>
          <Link
            to="/settings/store" //chỉnh lại đường dẫn
            className={`font-bold text-lg flex py-3 pl-3 pr-1 rounded-lg ${
              location.pathname === "/settings/store"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <FaShoppingCart size = "35" className="mr-2" />
          </Link>
        </li>


        <li>
          <Link
            to="/settings/utils" //chỉnh lại đường dẫn
            className={`font-bold text-lg flex py-3 pl-3 pr-1 rounded-lg ${
              location.pathname === "/settings/utils"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <FaToolbox size = "35" className="mr-2" />
          </Link>
        </li>
        <li onClick={handleSignOut} className="cursor-pointer flex py-3 pl-3 pr-1 rounded-lg hover:bg-gray-700"> 
          <FaSignOutAlt size = "35" className="mr-2" />
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
