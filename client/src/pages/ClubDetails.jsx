import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import clubsData from "../data/clubsData";

function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const club = clubsData.find((c) => c.id === id);

  if (!club) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl">
          Club not found
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

        {/* Header */}
        <div className="text-center mb-10">
          <div className="h-44 w-full max-w-3xl mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={club.logo}
              alt={club.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/club-placeholder.svg";
              }}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold">
            {club.name}
          </h1>
        </div>

        {/* Description */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            About the Club
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Leadership Section */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Faculty Heads
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {club.facultyHeads.map((head, index) => (
                <li key={index}>{head}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Student Leadership
            </h3>
            <p><strong>President:</strong> {club.president}</p>
            <p><strong>Vice President:</strong> {club.vicePresident}</p>
            <p><strong>Treasurer:</strong> {club.treasurer}</p>
          </div>
        </div>

        {/* Volunteers */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Active Volunteers
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {club.volunteers.map((volunteer, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 rounded-lg text-center"
              >
                {volunteer}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ClubDetails;
