import React, { useState, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../../redux/user/userSlice";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { VscFeedback } from "react-icons/vsc";
import { TbReport } from "react-icons/tb";

import { ImProfile } from "react-icons/im";


import { IoPersonAddSharp } from "react-icons/io5";
import { FaBuilding, FaHome, FaSignOutAlt, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

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
      dispatch(signOutUserFailure(error.message));
    }
  };

  const SidebarItem = ({ icon, text, to }) => (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          location.pathname === to
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-600 text-gray-300"
        }
      `}
    >
      <Link to={to} className="flex items-center w-full">
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Link>
    </li>
  );

  return ( 
    <aside className="min-h-screen overflow-y-auto flex flex-col">
      <nav className="min-h-screen bg-gray-800 text-white shadow-sm">
        {/* Header Section */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <span className="text-slate-100 font-bold">Group35</span>
            <span className="text-slate-300 font-bold">Estate</span>
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="flex-1 px-3">
          <SidebarItem icon={<FaHome />} text="Home" to="/admin/homepage" />
          <SidebarItem
            icon={<FaUsers />}
            text="Users Management"
            to="/admin/user-list"
          />
          <SidebarItem
            icon={<FaBuilding />}
            text="Post Management"
            to="/admin/estate-list"
          />
          <SidebarItem
            icon={<VscFeedback />}
            text="Feedbacks"
            to="/admin/feed-back"
          />
          <SidebarItem icon={<TbReport />} text="Reports" to="/admin/report" />
          <SidebarItem
            icon={<ImProfile />}
            text="Setting"
            to="/admin/profile"
          />
          <SidebarItem
            icon={<IoPersonAddSharp />}
            text="Add new Admin"
            to="/admin/new-admin"
          />
          
          <li
            className="relative flex items-center py-2 px-3 my-1
            font-medium rounded-md 
            transition-colors hover:bg-gray-600 cursor-pointer text-gray-300"
            onClick={handleSignOut}
          >
            <FaSignOutAlt />
            <span
              className={`overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              }`}
            >
              Sign Out
            </span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
