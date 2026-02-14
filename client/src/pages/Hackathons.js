import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { hackathons } from "../data/hackathons";

function Hackathons() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return hackathons.filter((h) =>
      [h.name, h.location, h.mode, h.themes.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Hackathons</h1>
            <p className="text-gray-600">
              Discover events, explore themes, and apply with one click.
            </p>
          </div>

          <input
            aria-label="Search hackathons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, theme, or location"
            className="px-3 py-2 border rounded-md w-full md:w-72"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="p-5 border rounded-xl bg-white shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{h.name}</h2>
                <div className="text-sm text-gray-600">
                  Date: {h.date} | Duration: {h.duration} | Location: {h.location}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="px-2 py-1 rounded-full bg-gray-100">Mode: {h.mode}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100">Team: {h.teamSize}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100">
                    Fee: {h.registrationFee}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100">
                    Deadline: {h.deadline}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">Prize: {h.prize}</div>
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Link
                    to={`/hackathons/${h.id}`}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/hackathons/${h.id}/apply`}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Hackathons;
