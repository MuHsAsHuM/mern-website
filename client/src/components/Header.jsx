import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  FaHome,FaCog, FaInfoCircle, FaSignInAlt } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md  w-full z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Group35</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="flex items-center gap-x-2 text-slate-700 hover:underline">
             <FaHome/>Home
            </li>
          </Link>
          <Link to="/about">
            <li className="flex items-center gap-x-2 text-slate-700 hover:underline">
              <FaInfoCircle/>About
            </li>
          </Link>
          {currentUser && currentUser.isAdmin && (
            <Link to="/admin/homepage">
              <li className="flex items-center gap-x-2 text-slate-700 hover:underline">
               <FaCog/> Admin
              </li>
            </Link>
          )}
          <Link to={currentUser && currentUser.isAdmin ? "/admin/profile" : "/settings/user-profile"}>

            {currentUser ? (
              currentUser.isAdmin ? (
              // Nếu là admin, không hiển thị gì
              null
              ) : (
      // Nếu không phải admin, hiển thị ảnh đại diện
              <img
              className="rounded-full h-7 w-7 object-cover"
              src={currentUser.avatar}
              alt="profile"
              />
              
              )
          ) : (
    // Nếu không có currentUser (chưa đăng nhập), hiển thị "Sign in"
              <li className="flex items-center gap-x-2 text-slate-700 hover:underline">
                <FaSignInAlt/> Sign in
                </li>
              )}
            </Link>
        </ul>
      </div>
    </header>
  );
}
