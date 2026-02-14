import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const PAGE_SIZE = 6;
const TAB_OPTIONS = ["all", "hackathon", "fellowship", "event", "program", "club", "other"];
const TAB_ROUTES = {
  hackathon: "/hackathons",
  event: "/events",
  club: "/clubs",
};

const getRouteByType = (type) => {
  const normalizedType = (type || "").toLowerCase();
  if (normalizedType === "hackathon") return "/hackathons";
  if (normalizedType === "club") return "/clubs";
  if (normalizedType === "event") return "/events";
  if (normalizedType === "job" || normalizedType === "internship") return "/jobs";
  return null;
};

const getActionLabelByType = (type) => {
  const normalizedType = (type || "").toLowerCase();
  if (normalizedType === "hackathon") return "Go to Hackathons";
  if (normalizedType === "club") return "Go to Clubs";
  if (normalizedType === "event") return "Go to Events";
  if (normalizedType === "job" || normalizedType === "internship") return "Go to Jobs";
  return "Apply";
};

function Opportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks")) || {}
  );
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await API.get("/opportunities/recommended");
      setOpportunities(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const applyHandler = async (id) => {
    try {
      await API.post(`/opportunities/${id}/apply`);
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      alert("Already applied or error");
    }
  };

  const toggleBookmark = (id) => {
    const next = { ...bookmarks };
    if (next[id]) delete next[id];
    else next[id] = true;
    setBookmarks(next);
    localStorage.setItem("bookmarks", JSON.stringify(next));
  };

  const baseList = useMemo(() => {
    return (opportunities || []).filter((op) => {
      const type = (op.type || "other").toLowerCase();
      return type !== "job" && type !== "internship";
    });
  }, [opportunities]);

  // client-side filtering + sorting
  const filtered = useMemo(() => {
    let list = baseList;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((op) =>
        [op.title, op.company, op.description, op.location]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filterType !== "all") {
      list = list.filter(
        (op) => (op.type || "other").toLowerCase() === filterType
      );
    }

    if (sortBy === "match") {
      list = list.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    } else if (sortBy === "recent") {
      list = list.sort(
        (a, b) => new Date(b.postedAt || Date.now()) - new Date(a.postedAt || Date.now())
      );
    }

    return list;
  }, [baseList, query, filterType, sortBy]);

  const totalPages = Math.max(1, Math.ceil((filtered.length || 0) / PAGE_SIZE));
  const visible = filtered.slice(0, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const total = baseList.length;
    const applied = baseList.filter((op) => op.applied).length;
    const bookmarked = Object.keys(bookmarks).length;
    const avgMatch =
      baseList.reduce((sum, op) => sum + (op.matchPercentage || 0), 0) /
      Math.max(1, baseList.length);
    return {
      total,
      applied,
      bookmarked,
      avgMatch: Math.round(avgMatch),
    };
  }, [baseList, bookmarks]);

  const closeModal = () => setSelected(null);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="pt-6 pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-gray-600 mt-1">
              Discover hackathons, fellowships, events, and campus programs.
            </p>
          </div>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm w-fit"
          >
            Go to Jobs & Internships
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-semibold mt-1">{stats.total}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Applied</div>
            <div className="text-2xl font-semibold mt-1">{stats.applied}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Bookmarked</div>
            <div className="text-2xl font-semibold mt-1">{stats.bookmarked}</div>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Avg Match</div>
            <div className="text-2xl font-semibold mt-1">{stats.avgMatch}%</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (TAB_ROUTES[tab]) {
                    navigate(TAB_ROUTES[tab]);
                    return;
                  }
                  setFilterType(tab);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm border ${
                  filterType === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1 flex flex-col md:flex-row gap-3">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, organizer, location"
                className="flex-1 border p-2 rounded"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="recent">Most recent</option>
                <option value="match">Best match</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">{filtered.length} results</div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-white rounded shadow animate-pulse h-28" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-6 rounded shadow">
            This feature is coming soon for this category.
          </div>
        ) : (
          <div className="grid gap-6">
            {visible.map((op) => {
              const id = op._id || op.id;
              const route = getRouteByType(op.type);
              const actionLabel = getActionLabelByType(op.type);
              return (
                <div
                  key={id}
                  className="bg-white p-6 rounded-xl shadow border flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {op.logo ? (
                        <img src={op.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-500">Logo</div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold">{op.title || op.name || "Opportunity"}</h2>
                        <span className="text-sm text-gray-500">{op.company || op.organizer}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                          {(op.type || "Other").toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">
                        {(op.description || "").slice(0, 180)}
                        {(op.description || "").length > 180 ? "..." : ""}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {(op.skillsRequired || []).slice(0, 6).map((skill, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Location: {op.location || "On-campus / Remote"} | Deadline: {op.deadline || "Rolling"}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-52 flex flex-col items-start md:items-end gap-3">
                    <div className="text-lg font-semibold text-green-600">
                      {op.matchPercentage || 0}% Match
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {route ? (
                        <Link to={route} className="bg-blue-600 text-white px-4 py-2 rounded">
                          {actionLabel}
                        </Link>
                      ) : op.applied ? (
                        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => applyHandler(id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          {actionLabel}
                        </button>
                      )}

                      <button
                        onClick={() => toggleBookmark(id)}
                        className="border px-3 py-2 rounded"
                      >
                        {bookmarks[id] ? "Bookmarked" : "Bookmark"}
                      </button>

                      <button
                        onClick={() => setSelected(op)}
                        className="border px-3 py-2 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {page < totalPages && (
              <div className="text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-gray-100 px-4 py-2 rounded"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{selected.title || selected.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selected.company || selected.organizer} | {selected.location || "On-campus / Remote"}
                </p>
              </div>
              <button className="text-gray-500" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="border rounded-lg p-3">
                <div className="text-gray-500">Type</div>
                <div className="font-medium mt-1">{selected.type || "Other"}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-gray-500">Match</div>
                <div className="font-medium mt-1">{selected.matchPercentage || 0}%</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-gray-500">Deadline</div>
                <div className="font-medium mt-1">{selected.deadline || "Rolling"}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-gray-500">Posted</div>
                <div className="font-medium mt-1">{selected.postedAt || "Recent"}</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              {selected.description || "No description available."}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(selected.skillsRequired || []).map((skill, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {getRouteByType(selected.type) ? (
                <Link
                  to={getRouteByType(selected.type)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {getActionLabelByType(selected.type)}
                </Link>
              ) : (
                <button
                  onClick={() => applyHandler(selected._id || selected.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={selected.applied}
                >
                  {selected.applied ? "Applied" : "Apply Now"}
                </button>
              )}
              <button
                onClick={() => toggleBookmark(selected._id || selected.id)}
                className="border px-4 py-2 rounded"
              >
                {bookmarks[selected._id || selected.id] ? "Bookmarked" : "Bookmark"}
              </button>
              <button onClick={closeModal} className="border px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Opportunities;
