import { useParams } from "react-router-dom";
import reportImage from "../../components/images/reportImage.jpg";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ReportForm() {
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const options = [
    "Spam",
    "Harassment",
    "False Information",
    "Copyright or Legal Issues",
    "Violence or Dangerous Behavior",
    "Scam or Fraud",
    "Other",
  ];

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if a reason is selected
    if (!selected) {
      setError("Please select a reason for the report.");
      setSuccess("");
      return;
    }

    if (!currentUser || !currentUser._id) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    // Prepare the data to send to the backend
    const reportData = {
      reportedBy: currentUser._id,
      reportedListing: listingId,
      content: selected, // You can customize this based on your use case
    };

    try {
      // Make the API request to create a new report
      const response = await fetch(`/api/user/createReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit the report.");
        setSuccess("");
        return;
      }

      const data = await response.json();
      setSuccess("Report submitted successfully!");
      setError("");
      console.log("Report created:", data);
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("An error occurred while submitting the report.");
      setSuccess("");
    }
  };

  return (
    <div className="p-5 m-5 shadow-lg max-w-lg mx-auto bg-white">
      <div>
        <img src={reportImage} alt="Report Image" className="w-full" />
      </div>

      <h2 className="text-xl mt-2 text-center font-bold mb-4">Submit Report</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input type="hidden" value={listingId} name="listingId" />

        <label className="block mb-2">Reason for Report:</label>
        <select
          value={selected}
          onChange={handleSelect}
          className="block w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select a reason...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selected && <p className="mt-2">Selected: {selected}</p>}

        <button
          type="submit"
          className="bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4 w-full"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
