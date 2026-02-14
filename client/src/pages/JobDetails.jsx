import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const jobs = [
  {
    id: 1,
    type: "Full-time",
    company: "TechCorp",
    role: "Frontend Developer",
    location: "Hyderabad",
    posted: "2026-02-01",
    status: "Open",
    description:
      "We are looking for a skilled Frontend Developer to build scalable and high-performance web applications using React and modern UI frameworks.",
    eligibility: "B.Tech / B.E (CSE/IT) 2024-2026 passouts",
    duration: "Permanent",
    stipend: "₹8 LPA - ₹12 LPA",
    skills: ["React", "JavaScript", "Tailwind", "REST APIs"],
    timings: "9:00 AM - 6:00 PM",
  },
  {
    id: 2,
    type: "Internship",
    company: "DataWorks",
    role: "Data Science Intern",
    location: "Remote",
    posted: "2026-01-25",
    status: "Open",
    description:
      "Work on real-time machine learning projects involving prediction models, dashboards, and data visualization systems.",
    eligibility: "3rd/4th Year Engineering Students",
    duration: "6 Months",
    stipend: "₹15,000/month",
    skills: ["Python", "Pandas", "Machine Learning", "Data Visualization"],
    timings: "Flexible Working Hours",
  },
  {
    id: 3,
    type: "Internship",
    company: "BuildBots",
    role: "Robotics Intern",
    location: "Campus",
    posted: "2026-01-30",
    status: "Closed",
    description:
      "Assist in developing automation systems and robotics prototypes for industrial solutions.",
    eligibility: "Mechanical / ECE / Robotics Students",
    duration: "3 Months",
    stipend: "₹10,000/month",
    skills: ["Robotics", "Arduino", "Sensors"],
    timings: "10:00 AM - 5:00 PM",
  },
];

function statusBadge(status) {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700 border border-green-300";
    case "Closed":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
}

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === parseInt(id));

  if (!job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Jobs
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          {"<-"}
          Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{job.role}</h1>
          <p className="text-gray-600 mt-1">
            {job.company} · {job.location}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              {job.type}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${statusBadge(
                job.status
              )}`}
            >
              {job.status}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <p>
              <strong>Eligibility:</strong> {job.eligibility}
            </p>
            <p>
              <strong>Duration:</strong> {job.duration}
            </p>
            <p>
              <strong>Stipend / Salary:</strong> {job.stipend}
            </p>
            <p>
              <strong>Working Hours:</strong> {job.timings}
            </p>
            <p>
              <strong>Posted On:</strong> {job.posted}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div>
            <button
              disabled={job.status === "Closed"}
              onClick={() => navigate(`/jobs/${job.id}/apply`)}
              className={`w-full py-3 rounded-lg text-white text-lg transition 
              ${
                job.status === "Closed"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {job.status === "Closed"
                ? "Applications Closed"
                : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default JobDetails;

