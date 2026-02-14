import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Layout from "../components/Layout";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend);

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    let frame = 0;
    const steps = 24;
    const timer = setInterval(() => {
      frame += 1;
      const next = Math.round((target * frame) / steps);
      setDisplay(next);
      if (frame >= steps) clearInterval(timer);
    }, 18);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}{suffix}</span>;
};

function Analytics() {
  const { user } = useContext(AuthContext);
  const [opportunities, setOpportunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New internship posted: Frontend Intern" },
    { id: 2, text: "Club meetup tomorrow at 5 PM" },
  ]);

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    const userId = user?.id || user?._id;

    if (userId) {
      socket.emit("join:user", userId);
    }

    socket.on("announcement:new", (payload) => {
      setNotifications((prev) => [{ id: Date.now(), text: `[Announcement] ${payload.message}` }, ...prev].slice(0, 8));
    });

    socket.on("notification:new", (payload) => {
      setNotifications((prev) => [{ id: Date.now(), text: payload.message }, ...prev].slice(0, 8));
    });

    socket.on("interview:status", (payload) => {
      const readable = `Interview update: ${payload.title} is now ${payload.status.replace("_", " ")}`;
      setNotifications((prev) => [{ id: Date.now(), text: readable }, ...prev].slice(0, 8));
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, user?._id]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingAnalytics(true);
      try {
        const [oppRes, eventRes] = await Promise.all([
          API.get("/opportunities"),
          API.get("/events").catch(() => ({ data: [] })),
        ]);
        setOpportunities(oppRes.data || []);
        setEvents(eventRes.data || []);
      } catch (error) {
        console.error("Failed to load dashboard analytics", error);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchDashboardData();
  }, []);

  const analytics = useMemo(() => {
    const userId = user?.id || user?._id;
    const appliedItems = opportunities.filter((op) => {
      const applicants = op?.applicants || [];
      return applicants.some((id) => String(id) === String(userId));
    });

    return {
      totalApplications: appliedItems.length,
      interviewScheduled: appliedItems.filter((op) => op.status === "interview_scheduled").length,
      rejected: appliedItems.filter((op) => op.status === "closed").length,
      savedJobs: Object.keys(JSON.parse(localStorage.getItem("bookmarks") || "{}")).length,
      upcomingEvents: events.length,
    };
  }, [events.length, opportunities, user?.id, user?._id]);

  const chartData = {
    labels: ["Applications", "Interview", "Rejected", "Saved", "Events"],
    datasets: [
      {
        label: "Analytics",
        data: [
          analytics.totalApplications,
          analytics.interviewScheduled,
          analytics.rejected,
          analytics.savedJobs,
          analytics.upcomingEvents,
        ],
        backgroundColor: [
          "rgba(14, 116, 144, 0.72)",
          "rgba(59, 130, 246, 0.72)",
          "rgba(239, 68, 68, 0.72)",
          "rgba(16, 185, 129, 0.72)",
          "rgba(245, 158, 11, 0.72)",
        ],
        borderRadius: 10,
      },
    ],
  };

  const SkeletonCard = () => <div className="h-24 rounded-xl bg-slate-200/70 animate-pulse" />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <main className="flex-1">
          <div className="mb-8 pt-6 pb-2">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Campus Connect Analytics</h1>
            <p className="mt-3 text-gray-600 text-lg">Live dashboard for applications, interviews, and upcoming campus activity.</p>
          </div>

          {loadingAnalytics ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="cc-panel rounded-xl p-4">
                <div className="text-sm text-gray-500">Total Applications</div>
                <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={analytics.totalApplications} /></div>
              </div>
              <div className="cc-panel rounded-xl p-4">
                <div className="text-sm text-gray-500">Interview Scheduled</div>
                <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={analytics.interviewScheduled} /></div>
              </div>
              <div className="cc-panel rounded-xl p-4">
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={analytics.rejected} /></div>
              </div>
              <div className="cc-panel rounded-xl p-4">
                <div className="text-sm text-gray-500">Saved Jobs</div>
                <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={analytics.savedJobs} /></div>
              </div>
              <div className="cc-panel rounded-xl p-4">
                <div className="text-sm text-gray-500">Upcoming Events</div>
                <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={analytics.upcomingEvents} /></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 cc-panel rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Analytics Overview</h2>
                <Link to="/opportunities" className="text-sm text-blue-600">View opportunities</Link>
              </div>
              {loadingAnalytics ? (
                <div className="h-72 rounded-xl bg-slate-200/70 animate-pulse" />
              ) : (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                  }}
                />
              )}
            </div>

            <aside className="space-y-6">
              <div className="cc-panel rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold">Live Notifications</div>
                  <button onClick={() => setNotifications([])} type="button" className="text-sm text-blue-600">Clear</button>
                </div>
                <ul className="text-sm space-y-2">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-gray-700">- {n.text}</li>
                  ))}
                </ul>
                {notifications.length === 0 && <p className="text-sm text-gray-500">No new notifications.</p>}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Analytics;
