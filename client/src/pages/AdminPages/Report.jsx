import { useEffect, useState } from "react";
import ReportListing from "../../components/ReportListing";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const currentReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasData = reports.length > 0;

  const API_BASE_URL = "/api/admin";

  // Hàm gọi API để lấy report
  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getReports`);
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      console.log(data);
      setReports(data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Hàm gọi API để xóa report
  const deleteReport = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteReport/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete report");
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await deleteReport(selected._id);
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== selected._id)
        );
        setSelected(null);
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold border-b text-slate-700">
          User Reports
        </h1>
        <button
          className={`${
            selected ? "bg-red-700 hover:bg-red-800" : "bg-gray-800"
          } text-white rounded-lg uppercase p-3`}
          disabled={!selected}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      <div className="mt-5">
        <ReportListing
          reports={currentReports}
          selected={selected}
          setSelected={setSelected}
        />
        {hasData && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
