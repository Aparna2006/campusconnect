import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { findHackathonById } from "../data/hackathons";

function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = findHackathonById(id);

  if (!hackathon) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Hackathon Not Found</h2>
          <button
            onClick={() => navigate("/hackathons")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Hackathons
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          {"<-"}
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{hackathon.name}</h1>
          <p className="text-gray-600 mt-1">
            Date: {hackathon.date} | Duration: {hackathon.duration} | Location: {hackathon.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              {hackathon.mode}
            </span>
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              Team: {hackathon.teamSize}
            </span>
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              Fee: {hackathon.registrationFee}
            </span>
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              Deadline: {hackathon.deadline}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Project Theme</h2>
            <p className="text-gray-700 leading-relaxed">
              {hackathon.projectTheme}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <p>
              <strong>Eligibility:</strong> {hackathon.eligibility}
            </p>
            <p>
              <strong>Registration Fee:</strong> {hackathon.registrationFee}
            </p>
            <p>
              <strong>Team Size:</strong> {hackathon.teamSize}
            </p>
            <p>
              <strong>Mode:</strong> {hackathon.mode}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Themes</h2>
            <div className="flex flex-wrap gap-3">
              {hackathon.themes.map((theme) => (
                <span
                  key={theme}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="space-y-2 text-gray-700">
                {hackathon.requirements.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Documents Required</h2>
              <ul className="space-y-2 text-gray-700">
                {hackathon.documentsRequired.map((doc) => (
                  <li key={doc}>- {doc}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-gray-700">
              <div>
                <strong>Prize:</strong> {hackathon.prize}
              </div>
              <div>
                <strong>Status:</strong> {hackathon.status}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/hackathons/${hackathon.id}/apply`}
                className="px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition text-center"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HackathonDetails;
