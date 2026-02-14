import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Layout from "../components/Layout";

function Dashboard() {
  const { user, updateUser } = useContext(AuthContext);

  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [matchScore, setMatchScore] = useState(0);

  const [events] = useState([
    { id: 1, title: "HackFest 2026", date: "Mar 12", venue: "Auditorium" },
    { id: 2, title: "AI Workshop", date: "Feb 25", venue: "Lab 4" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New internship posted: Frontend Intern" },
    { id: 2, text: "Club meetup tomorrow at 5 PM" },
  ]);

  const calculateMatch = useCallback((ops) => {
    if (!ops.length || !skills.length) return 20;

    let matched = 0;
    ops.forEach((op) => {
      const commonSkills = op.requiredSkills?.filter((s) => skills.includes(s));
      if (commonSkills && commonSkills.length > 0) matched++;
    });

    const rawScore = Math.round((matched / ops.length) * 100);
    return Math.min(40, Math.max(20, rawScore));
  }, [skills]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await API.get("/opportunities");
        setOpportunities(res.data);
        setMatchScore(calculateMatch(res.data));
      } catch (err) {
        console.error("Failed to load opportunities");
      }
    };

    fetchOpportunities();
  }, [skills]);

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      setLoading(true);
      const res = await API.put("/users/skills", {
        skills: [...skills, newSkill],
      });

      setSkills(res.data.skills);
      updateUser({ skills: res.data.skills });
      setNewSkill("");
    } catch (err) {
      alert("Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <main className="flex-1">
          <div className="mb-8 pt-6 pb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Campus Connect</h1>
            <p className="mt-3 text-gray-600 text-lg">A single place for campus events, clubs, opportunities, hackathons and jobs.</p>
            <div className="mt-4">
              <input placeholder="Search events, clubs, jobs..." className="border rounded px-4 py-3 w-full md:w-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-500">Skills</div>
                  <div className="text-xl font-semibold">{skills.length}</div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-500">Applied</div>
                  <div className="text-xl font-semibold">0</div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-500">Opportunities</div>
                  <div className="text-xl font-semibold">{opportunities.length}</div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <div className="text-sm text-gray-500">Match</div>
                  <div className="text-xl font-semibold">{matchScore}%</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  <Link to="/events" className="text-sm text-blue-600">See all</Link>
                </div>

                <div className="grid gap-3">
                  {events.map((e) => (
                    <div key={e.id} className="flex justify-between items-center border rounded p-3">
                      <div>
                        <div className="font-medium">{e.title}</div>
                        <div className="text-sm text-gray-500">{e.venue} - {e.date}</div>
                      </div>
                      <Link
                        to="/events"
                        state={{ eventId: e.id }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Register
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Opportunities</h3>
                    <Link to="/opportunities" className="text-sm text-blue-600">Browse</Link>
                  </div>

                  {opportunities.slice(0, 4).map((op) => (
                    <div key={op._id || op.id} className="py-2 border-b last:border-b-0">
                      <div className="font-medium">{op.title || op.name || "Opportunity"}</div>
                      <div className="text-sm text-gray-500">{op.company || op.organizer || "Company"}</div>
                    </div>
                  ))}
                  {opportunities.length === 0 && <p className="text-gray-500">No opportunities yet</p>}
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Hackathons & Jobs</h3>
                    <Link to="/hackathons" className="text-sm text-blue-600">Explore</Link>
                  </div>

                  <div className="text-sm text-gray-600">Find upcoming hackathons and on-campus placements here. Check deadlines and register.</div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white p-6 rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Profile</div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-green-600 font-semibold">Active</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/profile" className="text-sm text-blue-600">View profile</Link>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold">Notifications</div>
                  <button onClick={() => setNotifications([])} type="button" className="text-sm text-blue-600">Clear</button>
                </div>
                <ul className="text-sm space-y-2">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-gray-700">- {n.text}</li>
                  ))}
                </ul>
                {notifications.length === 0 && (
                  <p className="text-sm text-gray-500">No new notifications.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <Link to="/events" className="text-sm text-blue-600">Create/Join Event</Link>
                  <Link to="/clubs" className="text-sm text-blue-600">Explore Clubs</Link>
                  <Link to="/opportunities" className="text-sm text-blue-600">Apply for Opportunity</Link>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-6 bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Skills</h2>
              <div className="text-sm text-gray-500">Tip: add skills to improve match</div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Add a new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button
                onClick={addSkill}
                disabled={loading}
                className="bg-blue-600 text-white px-4 rounded"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>

            {skills.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <li key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Dashboard;
