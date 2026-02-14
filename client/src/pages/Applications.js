import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useApplications } from "../context/ApplicationContext";

const statusSteps = ["Applied", "Pending", "Shortlisted", "Interview", "Accepted", "Rejected", "Withdrawn"];

function statusColor(status) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Interview":
      return "bg-blue-100 text-blue-800";
    case "Shortlisted":
      return "bg-green-100 text-green-800";
    case "Accepted":
      return "bg-teal-100 text-teal-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Withdrawn":
      return "bg-gray-200 text-gray-700";
    case "Applied":
    default:
      return "bg-indigo-100 text-indigo-800";
  }
}

function getNextStep(status) {
  if (status === "Applied" || status === "Pending") return "Waiting for shortlisting";
  if (status === "Shortlisted") return "Interview scheduling";
  if (status === "Interview") return "Interview feedback";
  if (status === "Accepted") return "Offer onboarding";
  if (status === "Rejected") return "Closed";
  if (status === "Withdrawn") return "Closed";
  return "In review";
}

function Applications() {
  const { applications, updateStatus } = useApplications();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesQuery = [a.company, a.role, a.location, a.type]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = filter === "All" || a.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [applications, query, filter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) => !["Rejected", "Withdrawn"].includes(a.status)).length;
    const interviews = applications.filter((a) => a.status === "Interview").length;
    const offers = applications.filter((a) => a.status === "Accepted").length;
    return { total, active, interviews, offers };
  }, [applications]);

  function handleWithdraw(app) {
    if (!window.confirm("Withdraw application? This action cannot be undone.")) return;
    updateStatus(app.jobId, "Withdrawn");
  }

  function handleScheduleInterview(app) {
    updateStatus(app.jobId, "Interview", "2026-02-20");
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Applications</h2>
            <p className="text-gray-600">Track progress, updates, and actions in real time.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              aria-label="Search applications"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company, role, location"
              className="px-3 py-2 border rounded-md w-full md:w-64"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option>All</option>
              <option>Applied</option>
              <option>Pending</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Withdrawn</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Applications</div>
            <div className="text-2xl font-semibold mt-1">{stats.total}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-2xl font-semibold mt-1">{stats.active}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Interviews</div>
            <div className="text-2xl font-semibold mt-1">{stats.interviews}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Offers</div>
            <div className="text-2xl font-semibold mt-1">{stats.offers}</div>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-gray-600">No applications match your search.</div>
          )}

          {filtered.map((app) => (
            <div key={app.jobId} className="p-5 border rounded-xl bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-lg font-semibold">{app.role}</h3>
                    <span className="text-sm text-gray-500">at {app.company}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Date Applied: {app.dateApplied} | Location: {app.location} | Type: {app.type}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Next step: {getNextStep(app.status)}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-md text-sm ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(app)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      View Details
                    </button>
                    {!["Rejected", "Withdrawn", "Accepted"].includes(app.status) && (
                      <button
                        onClick={() => handleWithdraw(app)}
                        className="px-3 py-1 border rounded text-sm text-red-600"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2 text-xs text-gray-600">
                {statusSteps.map((step) => (
                  <div
                    key={step}
                    className={`px-2 py-1 rounded-full text-center border ${
                      step === app.status ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-gray-50"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{selected.role}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selected.company} | {selected.location} | {selected.type}
                  </p>
                </div>
                <button className="text-gray-500" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="border rounded-lg p-3">
                  <div className="text-gray-500">Date Applied</div>
                  <div className="font-medium mt-1">{selected.dateApplied}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-gray-500">Current Status</div>
                  <div className="font-medium mt-1">{selected.status}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-gray-500">Next Step</div>
                  <div className="font-medium mt-1">{getNextStep(selected.status)}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-gray-500">Interview Date</div>
                  <div className="font-medium mt-1">{selected.interviewDate || "Not scheduled"}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                {selected.status === "Applied" || selected.status === "Pending" ? (
                  <button
                    onClick={() => handleScheduleInterview(selected)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Schedule Interview
                  </button>
                ) : null}
                {!["Rejected", "Withdrawn", "Accepted"].includes(selected.status) && (
                  <button
                    onClick={() => handleWithdraw(selected)}
                    className="px-4 py-2 border rounded text-red-600"
                  >
                    Withdraw
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Applications;
