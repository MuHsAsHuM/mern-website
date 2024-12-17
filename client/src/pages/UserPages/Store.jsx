import React from 'react'
import {useState} from 'react';
import PaypalCheckoutButton from './PaypalCheckoutButton';
import { FaShoppingCart, FaRegCreditCard } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { updateGoldCard,updateSilverCard } from '../../redux/user/userSlice';
import { updateEmail } from 'firebase/auth';

export default function Store() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bundle = {
    "bundle1": {
      description: "Singe Common Card",
      type: "silver",
      quantity: 1,
      price: 4.99
    },
    "bundle2": {
      description: "Single Premium Card",
      quantity: 1,
      type:"gold",
      price: 9.99
    },
    "bundle3": {
      description: "Three Common Card Bundle",
      quantity: 3,
      type: "silver",
      price: 11.99
    },
    "bundle4": {
      description: "Three Gold Card Bundle",
      quantity: 3,
      type: "gold",
      price: 24.99
    }
  }

  const [selectedBundle, setSelectedBundle] = useState(null); // Quản lý bundle được chọn
  const [showPopup, setShowPopup] = useState(false); // Quản lý trạng thái hiển thị popup

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  console.log("Hôm nay là: " + formattedDate); // Đúng


  const handleSelectBundle = (key) => {
    setSelectedBundle(bundle[key]); // Lưu bundle được chọn
    setShowPopup(true); // Hiển thị popup
  };

  const closePopup = () => {
    setShowPopup(false); // Đóng popup
    setSelectedBundle(null); // Xóa bundle được chọn
  };

  const handlePurchase = (quantity, type) => {
    if (type === 'silver') {
      dispatch(updateSilverCard(quantity)); // Cập nhật silverCard
    }
    if (type === 'gold') {
      dispatch(updateGoldCard(quantity)); // Cập nhật silverCard
    }
    // Tương tự cho gold card (nếu cần)
  };

  const [silverCardCount, setSilverCardCount] = useState(currentUser.silverCard);
  const [goldCardCount, setGoldCardCount] = useState(currentUser.goldCard);


return (
  <div className="max-w-full  mx-auto  rounded-lg bg-slate-50  shadow-md p-3 justify-center">
    <div className = "text-4xl flex justify-center text-center gap-2">
      <FaShoppingCart></FaShoppingCart> Store
    </div>
    <div className="border-b-2 border-gray-300 w-full mb-6 mt-3"/>
    <div className = "flex gap-6 pl-6 ">
      <div className = 'border-2 border-gray-300 p-3 rounded-lg flex gap-6'>
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
    </div>
    </div>
    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Object.entries(bundle).map(([key, value]) => (
        <div
          key={key}
          className="h-40 flex flex-col items-center justify-center text-center border rounded-lg shadow-lg p-4 hover:bg-gray-200 transition cursor-pointer"
          onClick={() => handleSelectBundle(key)}
        > <div className='flex items-center gap-2'>
          {
            value.type === "silver" ? (
              <FaRegCreditCard className="text-gray-500 text-5xl" />   
            ) :
              <FaRegCreditCard className="text-yellow-500 text-5xl" />
          }
          x  {value.quantity}
          </div>
          <h3 className="text-lg font-bold">{value.description}</h3>
          {
            value.quantity === 1 ? (<p className="text-gray-800 font-semibold">Price: ${value.price}</p>)
            : (<p className="text-gray-800 font-semibold">Price: ${value.price} Sale off now</p>)
          }
          <p className="text-gray-800 font-semibold">Price: ${value.price}</p>
          <div className='border-b-2 border-slate-300 w-full'></div>
          <p className="text-gray-800 font-bold text-lg">BUY NOW</p>
        </div>
      ))}
    </div>
    </div>
    {/* Popup thanh toán */}
    {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg  w-96">
            <h2 className="text-2xl font-bold ">Confirm Your Payment</h2>
            <h2 className="text-m  mb-4">Quickly, secure and free transactions</h2>
            <div className = "bg-slate-200 rounded-lg p-2 mb-4">
              <h1 className = "font-semibold mb-2"> Details</h1>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="text-gray-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Selected Bundle:</span>
                <span className="text-gray-800">{selectedBundle.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Usernam:</span>
                <span className="text-gray-800">{currentUser.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{currentUser.email}</span>
              </div>
              <hr className="border-gray-300 my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>${selectedBundle.price}</span>
              </div>
            </div>
          
            <div className="flex flex-col items-center gap-2">
            <div className="w-full">
                <PaypalCheckoutButton product={selectedBundle} closePopup = {closePopup} 
                onPurchase={(quantity, type) => handlePurchase(quantity, type)}/>
            </div>
              <button
                className="w-full bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={closePopup}
              >
              Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
)
};
