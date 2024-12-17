import { useState } from "react";

function CreateAdmin() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage("");
      const res = await fetch("/api/admin/createAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccessMessage("Admin created successfully!");
      setLoading(false);
      setError(null);
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      setLoading(false);
      setError(error.message || "An error occurred");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="p-3 w-[30%] mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Create new Admin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          className="border p-3 rounded-lg"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Creating..." : "Create"}
        </button>
        
      </form>
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default CreateAdmin;
