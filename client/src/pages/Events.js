import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";

const events = [
  {
    id: 1,
    title: "Tech Talk: AI in Industry",
    date: "2026-03-05",
    time: "11:00 AM",
    venue: "Auditorium",
    organizer: "ASCI Club",
    duration: "2 hours",
    theme: "AI and Industry 4.0",
    about:
      "A session on applied AI with industry experts, live demos, and Q&A for students.",
  },
  {
    id: 2,
    title: "NSS Blood Donation Camp",
    date: "2026-03-12",
    time: "09:00 AM",
    venue: "Main Hall",
    organizer: "NSS Unit",
    duration: "5 hours",
    theme: "Community Health",
    about:
      "Community service event organized for students and staff with certified medical partners.",
  },
  {
    id: 3,
    title: "Inter-College Hackathon",
    date: "2026-04-02",
    time: "10:00 AM",
    venue: "Lab Block",
    organizer: "Coding Club",
    duration: "24 hours",
    theme: "Innovation and Prototyping",
    about:
      "A 24-hour hackathon for teams across colleges with mentors, prizes, and demo day.",
  },
  {
    id: 4,
    title: "GCCC Cultural Night",
    date: "2026-04-18",
    time: "06:30 PM",
    venue: "Open Grounds",
    organizer: "GCCC (Gayatri Cultural Club)",
    duration: "3 hours",
    theme: "Arts and Culture",
    about:
      "Cultural performances, music and dance showcases by student teams and guest artists.",
  },
  {
    id: 5,
    title: "Robotics Workshop",
    date: "2026-05-01",
    time: "02:00 PM",
    venue: "Robotics Lab",
    organizer: "Robotics Club",
    duration: "3 hours",
    theme: "Hands-on Robotics",
    about:
      "Hands-on session covering sensors, Arduino basics, and building a working prototype.",
  },
  {
    id: 6,
    title: "Placement Drive: TechCorp",
    date: "2026-05-15",
    time: "09:30 AM",
    venue: "Placement Cell Room",
    organizer: "Placement Cell",
    duration: "Full day",
    theme: "Campus Recruitment",
    about:
      "On-campus recruitment drive for CSE and IT students with aptitude and technical rounds.",
  },
];

const formatEventDate = (dateString) => {
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Events() {
  const [selected, setSelected] = useState(null);
  const location = useLocation();

  const closeModal = () => setSelected(null);

  useEffect(() => {
    const requestedId = location.state?.eventId;
    if (!requestedId) return;
    const matchedEvent = events.find((item) => item.id === requestedId);
    if (matchedEvent) {
      setSelected(matchedEvent);
    }
  }, [location.state]);

  return (
    <Layout>
      <section className="cc-glass rounded-3xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <span className="cc-chip">Calendar</span>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">Upcoming Events</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Stay updated with workshops, drives, hackathons, and campus activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {events.map((e) => (
            <div key={e.id} className="cc-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{e.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{e.about}</p>
                </div>
                <div className="min-w-[132px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 tabular-nums leading-5 tracking-wide whitespace-nowrap">
                    {formatEventDate(e.date)}
                  </div>
                  <div className="mt-1 tabular-nums whitespace-nowrap">{e.time}</div>
                  <div className="mt-1 leading-4">{e.venue}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="cc-chip">Organizer: {e.organizer}</span>
                <span className="cc-chip">Duration: {e.duration}</span>
                <span className="cc-chip">Theme: {e.theme}</span>
              </div>

              <button
                onClick={() => setSelected(e)}
                className="mt-5 cc-button cc-button-primary w-full text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{selected.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Date: {selected.date} | Time: {selected.time} | Venue: {selected.venue}
                  </p>
                </div>
                <button className="cc-button cc-button-soft px-3 py-1 text-sm" onClick={closeModal}>
                  Close
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-700">{selected.about}</p>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organizer</div>
                  <div className="mt-1 text-sm text-slate-700">{selected.organizer}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</div>
                  <div className="mt-1 text-sm text-slate-700">{selected.duration}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme</div>
                  <div className="mt-1 text-sm text-slate-700">{selected.theme}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Venue</div>
                  <div className="mt-1 text-sm text-slate-700">{selected.venue}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Events;
