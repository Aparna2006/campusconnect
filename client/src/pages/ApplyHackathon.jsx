import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { findHackathonById } from "../data/hackathons";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  collegeCity: "",
  year: "",
  branch: "",
  teamName: "",
  teamSize: "",
  projectTitle: "",
  theme: "",
  outstation: false,
  agree: false,
};

function ApplyHackathon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = findHackathonById(id);

  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState(false);

  const isClosed = useMemo(() => {
    if (!hackathon) return true;
    return hackathon.status !== "Open";
  }, [hackathon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const nextFiles = Array.from(e.target.files || []);
    setFiles(nextFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hackathon) return;

    if (isClosed) {
      alert("Applications are closed for this hackathon.");
      return;
    }

    if (!form.agree) {
      alert("Please accept the declaration.");
      return;
    }

    // TODO: Replace with backend API call.
    // eslint-disable-next-line no-console
    console.log("Hackathon application", {
      hackathonId: hackathon.id,
      hackathonName: hackathon.name,
      ...form,
      files: files.map((file) => ({ name: file.name, size: file.size })),
    });

    setSuccess(true);
    setTimeout(() => {
      navigate("/hackathons");
    }, 2000);
  };

  if (!hackathon) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl">Hackathon not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Apply for {hackathon.name}</h1>
          <p className="text-gray-600">
            Date: {hackathon.date} | Location: {hackathon.location} | Deadline: {hackathon.deadline}
          </p>
        </div>

        {isClosed && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            Applications are closed for this hackathon.
          </div>
        )}

        {success && !isClosed && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            Application submitted successfully. Redirecting...
          </div>
        )}

        {!success && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                name="college"
                placeholder="College Name"
                value={form.college}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                name="collegeCity"
                placeholder="College City"
                value={form.collegeCity}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduate</option>
              </select>

              <input
                name="branch"
                placeholder="Branch / Department"
                value={form.branch}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                name="teamName"
                placeholder="Team Name"
                value={form.teamName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <select
                name="teamSize"
                value={form.teamSize}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Team Size</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>

              <input
                name="projectTitle"
                placeholder="Project Title"
                value={form.projectTitle}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Theme</option>
                {hackathon.themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="outstation"
                checked={form.outstation}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-600">
                This is an outstation hackathon for me.
              </span>
            </div>

            <div>
              <label className="block mb-2 font-medium">Upload Documents</label>
              <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer w-fit">
                Choose Files
                <input type="file" className="hidden" multiple onChange={handleFileChange} />
              </label>
              <div className="mt-2 text-sm text-gray-600">
                {files.length === 0
                  ? "No files selected"
                  : files.map((file) => file.name).join(", ")}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              <span className="text-sm text-gray-600">
                I confirm the details are accurate and I accept the rules.
              </span>
            </div>

            <button
              type="submit"
              disabled={isClosed}
              className={`w-full py-3 rounded-lg text-white text-lg transition ${
                isClosed ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isClosed ? "Applications Closed" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default ApplyHackathon;
