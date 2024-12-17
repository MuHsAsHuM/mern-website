// AdminDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./SideBar";
import UserList from "./UserList";
import EstateList from "./EstateList";
import AdminProfile from "./AdminProfile";
import Feedback from "./Feedback";
import Report from "./Report";
import Homepage from "./Homepage";
import CreateAdmin from "./CreateAdmin";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar className="fixed"/>
      <div className="flex-grow p-6">
        <Routes>
          <Route path="homepage" element={<Homepage />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="estate-list" element={<EstateList />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="feed-back" element={<Feedback />} />
          <Route path="report" element={<Report />} />
          <Route path="new-admin" element={<CreateAdmin/>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
