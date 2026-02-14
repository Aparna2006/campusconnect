import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

function Support() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    issue: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardClick = (type) => {
    if (type === "guidance") {
      navigate("/ai-helper");
      return;
    }

    if (type === "bug") {
      setForm({
        ...form,
        category: "Bug Report",
        issue:
          "Please describe:\n1. What were you doing?\n2. What went wrong?\n3. Screenshot (if any)\n",
      });
      window.scrollTo({ top: 500, behavior: "smooth" });
      return;
    }

    if (type === "contact") {
      setForm({ ...form, category: "General Support" });
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await API.post("/support", form);
      if (res.data?.success) {
        setSuccess("Your request has been submitted successfully.");
        setForm({ name: "", email: "", category: "", issue: "" });
      } else {
        setError("Support request failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Support Center</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div
            onClick={() => handleCardClick("contact")}
            className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
            <p className="text-gray-600 text-sm">Reach out for technical help or account issues.</p>
          </div>

          <div
            onClick={() => handleCardClick("bug")}
            className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold mb-2">Report a Bug</h2>
            <p className="text-gray-600 text-sm">Found something broken? Report it instantly.</p>
          </div>

          <div
            onClick={() => handleCardClick("guidance")}
            className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-2xl transition"
          >
            <h2 className="text-lg font-semibold mb-2">Career Guidance</h2>
            <p className="text-gray-600 text-sm">
              Need help with skills or placements? Talk to AI Assistant.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6">Submit a Support Request</h2>

          {success && <div className="mb-4 text-green-600 font-medium">{success}</div>}
          {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg"
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              <option value="General Support">General Support</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Account Issue">Account Issue</option>
              <option value="Placement Guidance">Placement Guidance</option>
            </select>

            <textarea
              name="issue"
              value={form.issue}
              onChange={handleChange}
              placeholder="Describe your issue..."
              className="w-full border p-3 rounded-lg h-32"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition w-full"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Support;
