import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const SUGGESTED = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Data Structures",
  "Algorithms",
  "Django",
  "Machine Learning",
  "UI/UX",
  "Cloud",
];

function Skills() {
  const { user, setUser } = useContext(AuthContext);
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSkills(user?.skills || []);
  }, [user]);

  const saveSkills = async (nextSkills) => {
    try {
      setLoading(true);
      const res = await API.put("/users/skills", { skills: nextSkills });
      if (res?.data?.skills) {
        setSkills(res.data.skills);
        setUser && setUser({ ...user, skills: res.data.skills });
        localStorage.setItem("user", JSON.stringify({ ...user, skills: res.data.skills }));
      } else {
        // fallback
        setSkills(nextSkills);
        setUser && setUser({ ...user, skills: nextSkills });
        localStorage.setItem("user", JSON.stringify({ ...user, skills: nextSkills }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save skills; local update applied.");
      setSkills(nextSkills);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (skills.includes(s)) return setNewSkill("");
    const next = [...skills, s];
    saveSkills(next);
    setNewSkill("");
  };

  const removeSkill = (s) => {
    const next = skills.filter((k) => k !== s);
    saveSkills(next);
  };

  const profileComplete = Math.min(100, Math.round((skills.length / 10) * 100));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="pt-6 pb-4">
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-gray-600 mt-1">Add and manage your skills to improve opportunity matches.</p>
        </header>

        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Profile completion</div>
              <div className="text-xl font-semibold">{profileComplete}%</div>
            </div>
            <div className="w-2/5">
              <div className="h-3 bg-gray-200 rounded overflow-hidden">
                <div className="h-3 bg-green-500" style={{ width: `${profileComplete}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add a skill</h2>
          <div className="flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., React, Python" className="flex-1 border p-3 rounded" />
            <button onClick={addSkill} disabled={loading} className="bg-blue-600 text-white px-4 rounded">Add</button>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500">Suggested</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => { setNewSkill(s); }} className="bg-gray-100 px-3 py-1 rounded text-sm">{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your skills ({skills.length})</h2>
            <div className="text-sm text-gray-500">Tip: add 5-10 skills for better matches</div>
          </div>

          {skills.length === 0 ? (
            <p className="text-gray-500">You haven't added any skills yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <div key={s} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                  <span className="text-sm">{s}</span>
                  <button onClick={() => removeSkill(s)} className="text-xs text-red-600">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Skills;
