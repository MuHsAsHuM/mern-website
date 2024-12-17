import { useState } from "react";
import { useSelector } from "react-redux";

export default function Utils() {
  const { currentUser } = useSelector((state) => state.user);
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Content is required.");
      setSuccess("");
      return;
    }

    if (!currentUser || !currentUser._id) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    try {
      const response = await fetch("/api/user/createFeedBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedBackBy: currentUser._id,
          postTitle: postTitle || "",
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit feedback.");
        setSuccess("");
        return;
      }

      const data = await response.json();
      setSuccess("Feedback submitted successfully!");
      setError("");
      setPostTitle("");
      setContent("");
      console.log("Feedback created:", data);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("An error occurred while submitting feedback.");
      setSuccess("");
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white">
      <div>
        <img
          src="https://i0.wp.com/ketto.blog/wp-content/uploads/2021/09/shutterstock_1100033681-min-1.jpg?fit=5000%2C2813&ssl=1?resize=160,120"
          alt="feedback"
        />
      </div>
      <h2 className="text-xl mt-2 text-center font-bold mb-4">
        Submit Feedback
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="postTitle">
            Post Title
          </label>
          <input
            type="text"
            id="postTitle"
            className="w-full p-2 border rounded"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter the post title"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="content">
            Feedback Content
          </label>
          <textarea
            id="content"
            className="w-full p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your feedback"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
