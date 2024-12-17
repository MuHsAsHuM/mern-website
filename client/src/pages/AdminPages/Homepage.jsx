import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [listingStats, setListingStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, listingsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users/stats"),
          fetch("/api/admin/listings/stats"),
          fetch("/api/admin/orders/stats"),
        ]);

        const [usersData, listingsData, ordersData] = await Promise.all([
          usersRes.json(),
          listingsRes.json(),
          ordersRes.json(),
        ]);

        setUserStats(usersData);
        setListingStats(listingsData);
        setOrderStats(ordersData);

        setTotalUsers(usersData.reduce((sum, item) => sum + item.count, 0));
        setTotalListings(
          listingsData.reduce((sum, item) => sum + item.count, 0)
        );
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  // Kết hợp User và Listing vào biểu đồ Line
  const combinedLineData = {
    labels: userStats.map((item) => item._id),
    datasets: [
      {
        label: "Users",
        data: userStats.map((item) => item.count),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Listings",
        data: listingStats.map((item) => item.count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Biểu đồ Bar cho Order Income
  const orderBarData = {
    labels: orderStats.map((item) => item._id),
    datasets: [
      {
        label: "Daily Income ($)",
        data: orderStats.map((item) => item.totalIncome),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bảng thống kê Order (5 ngày gần nhất)
  const recentOrderStats = orderStats.slice(0, 5);

  return (
    <div className="flex flex-col container mx-auto p-2">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-4">Admin Dashboard</h1>

      <div className="flex flex-col ">
        <div className="flex justify-around">
          {/* Thống kê tổng Users và Listings */}
          <div className="flex gap-4 mb-8">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Users</h2>
              <p className="text-3xl">{totalUsers}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Listings</h2>
              <p className="text-3xl">{totalListings}</p>
            </div>

            {/* Bảng thống kê Order */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-center text-xl font-semibold mb-4">
                Recent Order Statistics
              </h2>
              <table className="table-auto w-[600px] text-center border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">
                      Total Income ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrderStats.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{item._id}</td>
                      <td className="border border-gray-300 p-2">
                        {item.totalIncome}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          {/* Biểu đồ Bar: Order Income */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-8 w-[550px]">
            <h2 className="text-center text-xl font-semibold mb-4">
              Daily Order Income
            </h2>
            <Bar data={orderBarData} options={{ responsive: true }} />
          </div>
          {/* Biểu đồ Line: Users và Listings */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-8 w-[550px]">
            <h2 className="text-center text-xl font-semibold mb-4">
              User & Listing Statistics
            </h2>
            <Line data={combinedLineData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
