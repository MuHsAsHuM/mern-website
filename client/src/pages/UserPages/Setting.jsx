// AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Profile from './Profile';
import UserProfile from './UserProfile';
import UserList from './UserList';
import Store from './Store';
import Utils from './Utils';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <UserSidebar className = "h-full" />
      <div className="flex-grow p-6 ">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="store" element={<Store />} />
          <Route path="utils" element={<Utils />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
