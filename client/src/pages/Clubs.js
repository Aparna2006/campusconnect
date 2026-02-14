import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import clubsData from "../data/clubsData";

function Clubs() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="cc-glass rounded-3xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <span className="cc-chip">Student Communities</span>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Discover Campus Clubs
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Explore active clubs, creative communities, and leadership spaces at Gayatri Vidya
            Parishad College of Engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {clubsData.map((club, index) => (
            <div
              key={club.id}
              onClick={() => navigate(`/clubs/${club.id}`)}
              className="cc-panel group cursor-pointer rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-amber-50 p-2">
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img
                    src={club.logo}
                    alt={club.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/images/club-placeholder.svg";
                    }}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{club.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{club.shortDesc}</p>

              <button className="mt-5 cc-button cc-button-soft w-full text-sm">View Details</button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Clubs;
