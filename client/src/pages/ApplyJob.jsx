import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useApplications } from "../context/ApplicationContext";

const mockJobs = [
  { id: 1, role: "Frontend Developer", company: "TechCorp" },
  { id: 2, role: "Data Science Intern", company: "DataWorks" },
  { id: 3, role: "Robotics Intern", company: "BuildBots" },
  { id: 4, role: "Backend Engineer", company: "GreenSoft" },
];

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, applyToJob } = useApplications();

  const job = mockJobs.find((j) => j.id === parseInt(id));

  const alreadyApplied = applications.find(
    (app) => app.jobId === parseInt(id)
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    resume: null,
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (alreadyApplied) {
      setSuccess(true);
    }
  }, [alreadyApplied]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.resume) {
      alert("Please upload resume");
      return;
    }

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    // Save to global context
    applyToJob({
      id: parseInt(id),
      role: job.role,
      company: job.company,
    });

    setSuccess(true);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/applications");
    }, 2000);
  };

  if (!job) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl">
          Job not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Apply for {job.role}
          </h1>
          <p className="text-gray-600">
            {job.company}
          </p>
        </div>

        {/* Already Applied Message */}
        {alreadyApplied && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg mb-6">
            You have already applied for this job.
          </div>
        )}

        {/* Success Message */}
        {success && !alreadyApplied && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            Application submitted successfully! Redirecting...
          </div>
        )}

        {/* Form */}
        {!alreadyApplied && !success && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 space-y-5"
          >
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="college"
              placeholder="College Name"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <select
              name="year"
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

            <div>
              <label className="block mb-2 font-medium">
                Upload Resume
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default ApplyJob;
