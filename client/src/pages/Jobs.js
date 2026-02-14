import Layout from "../components/Layout";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationContext";

const mockJobs = [
  {
    id: 1,
    type: "Full-time",
    company: "TechCorp",
    role: "Frontend Developer",
    location: "Hyderabad",
    posted: "2026-02-01",
    status: "Open",
  },
  {
    id: 2,
    type: "Internship",
    company: "DataWorks",
    role: "Data Science Intern",
    location: "Remote",
    posted: "2026-01-25",
    status: "Open",
  },
  {
    id: 3,
    type: "Internship",
    company: "BuildBots",
    role: "Robotics Intern",
    location: "Campus",
    posted: "2026-01-30",
    status: "Closed",
  },
  {
    id: 4,
    type: "Full-time",
    company: "GreenSoft",
    role: "Backend Engineer",
    location: "Visakhapatnam",
    posted: "2026-02-05",
    status: "Open",
  },
];

function statusBadge(status) {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700 border border-green-300";
    case "Closed":
      return "bg-red-100 text-red-700 border border-red-300";
    case "Applied":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "Interview Scheduled":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "Rejected":
      return "bg-red-200 text-red-800 border border-red-400";
    case "Selected":
      return "bg-green-200 text-green-800 border border-green-400";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
}

function Jobs() {
  const navigate = useNavigate();
  const { applications } = useApplications();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => {
      const matchesQuery = [j.company, j.role, j.location]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesType = filterType === "All" || j.type === filterType;

      return matchesQuery && matchesType;
    });
  }, [query, filterType]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Jobs & Internships</h1>
            <p className="text-gray-600 mt-1">
              Discover opportunities that match your skills.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company, role or location"
              className="px-4 py-2 border rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid gap-6">

          {filtered.length === 0 && (
            <div className="text-gray-600 text-center py-10">
              No job postings match your search.
            </div>
          )}

          {filtered.map((job) => {

            const appliedJob = applications.find(
              (app) => app.jobId === job.id
            );

            const currentStatus = appliedJob
              ? appliedJob.status
              : job.status;

            return (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-xl transition duration-300"
              >
                {/* Left Section */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">
                      {job.role}
                    </h2>
                    <span className="text-sm text-gray-500">
                      at {job.company}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    Location: {job.location} | Posted: {job.posted}
                  </div>

                  <div className="mt-2">
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${statusBadge(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                  </span>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>

                  {/* Apply Button */}
                  {appliedJob ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg text-sm text-white bg-gray-400 cursor-not-allowed"
                    >
                      Applied
                    </button>
                  ) : job.status === "Closed" ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg text-sm text-white bg-gray-400 cursor-not-allowed"
                    >
                      Closed
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/jobs/${job.id}/apply`)
                      }
                      className="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition"
                    >
                      Apply
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Jobs;
