import React, {useState} from 'react';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";

const PaypalCheckoutButton = (props) => {
    const {product,closePopup, onPurchase } = props;
    

    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);

    const [orderID, setOrderID] = useState(null);
    const {currentUser} = useSelector((state) => state.user);

    const createOrderData = (bundleData, orderID) => {
        // Lấy currentUser từ Redux store
        // Tạo orderData từ bundleData
        const orderData = {
          userRef: currentUser ? currentUser._id : null, // Lấy userRef từ currentUser
          bundle: bundleData.type,  // Mô tả bundle
          quantity: bundleData.quantity,        // Số lượng
          price: bundleData.price,               // Giá
          orderID: orderID
        };
      
        return orderData;
      };

    const createOrder = async (orderData) => {
        try {
          // Gửi yêu cầu POST đến API /api/user/createOrder
          const response = await fetch('/api/user/createOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Xác định kiểu dữ liệu gửi đi là JSON
            },
            body: JSON.stringify(orderData), // Chuyển đổi dữ liệu đơn hàng thành JSON
          });
      
          // Kiểm tra nếu phản hồi thành công
          if (!response.ok) {
            throw new Error('Không thể tạo đơn hàng');
          }
      
          // Chờ phản hồi JSON từ server
          const data = await response.json();
      
          // Xử lý dữ liệu trả về (ví dụ: hiển thị thông báo thành công)
          console.log('Đơn hàng đã được tạo thành công:', data);
          return data;
      
        } catch (error) {
          // Xử lý lỗi nếu có
          console.error('Lỗi khi tạo đơn hàng:', error);
        }
      }

    const handleApprove = (orderId) => {
        console.log(orderId)
        //setOrderID(orderId);
        const orderData = createOrderData(product,orderId);
        console.log(orderData);
        createOrder(orderData);
        onPurchase(product.quantity, product.type);
        alert("Thank You for purchasing from 35 Group");
        setOrderID(null);
        closePopup();
    }

    if(error){
        alert(error);
    }

  return (
    <PayPalScriptProvider>
        <PayPalButtons 
            onClick={(data, actions) => {
                const hasAlreadyBoughtCourse = false;
                if(hasAlreadyBoughtCourse){
                    setError("You Already bough this course");
                    return actions.reject();
                }else{
                    return actions.resolve();
                }
            }}
            createOrder = {(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: product.description,
                            amount: {
                                value: product.price,
                            },
                        },
                    ],
                });
            }}
            onApprove = { async (data, action) => {
                const order = await action.order.capture();
                console.log("order", order);

                handleApprove(data.orderID);
            }}
            onCancel={() => {}}
            onError={(err) => {
                setError(err);
                console.log("PayPal Checkout onError", err);
            }}
        />
    </PayPalScriptProvider>
  )
}

export default PaypalCheckoutButton