import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
  { to: "/skills", label: "Skills" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/applications", label: "Applications" },
  { to: "/events", label: "Events" },
  { to: "/clubs", label: "Clubs" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/jobs", label: "Jobs" },
  { to: "/support", label: "Support" },
  { to: "/ai-helper", label: "AI Helper" },
];

function Layout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">

      {/* Background Blobs */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-16 h-60 w-60 rounded-full bg-amber-300/30 blur-3xl" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              CampusConnect
            </h1>
            <p className="text-xs text-slate-500">
              Smart campus opportunities hub
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/analytics"
              className="cc-button cc-button-soft border-teal-200 text-teal-700 hover:border-teal-300"
            >
              Analytics
            </Link>
            <button
              onClick={handleLogout}
              className="cc-button cc-button-soft border-red-200 text-red-600 hover:border-red-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="mx-auto flex w-full max-w-[1400px] gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="cc-chip whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 mx-auto w-full max-w-[1400px] gap-5 px-4 pb-8 pt-5 lg:px-6">

        {/* SIDEBAR */}
        <aside className="cc-glass cc-fade-up hidden w-72 shrink-0 rounded-2xl p-4 lg:block">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="cc-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-full cc-fade-up">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 py-8 text-center text-white">
        <p className="text-sm opacity-80">
          © 2006 Rights Reserved
        </p>

        <p className="mt-3 text-xl font-extrabold tracking-wider">
          BUILT BY APARNA KONDIPARTHY
        </p>
      </footer>

    </div>
  );
}

export default Layout;
