import { useContext, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    photoUrl: user?.photoUrl || "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = useMemo(() => {
    const base = (form.name || "U").trim();
    if (!base) return "U";
    const parts = base.split(" ").filter(Boolean);
    return parts.length === 1
      ? parts[0].charAt(0).toUpperCase()
      : (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }, [form.name]);

  const completeness = useMemo(() => {
    const fields = [form.name, form.email, form.bio, form.phone, form.photoUrl];
    const filled = fields.filter((f) => (f || "").trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [form]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadPhoto = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("photo", file);

    try {
      const res = await API.post("/users/upload-photo", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.photoUrl) {
        setForm((f) => ({ ...f, photoUrl: res.data.photoUrl }));
        updateUser && updateUser({ photoUrl: res.data.photoUrl });
      } else {
        alert("Upload succeeded but server response unexpected.");
      }
    } catch (err) {
      console.error(err);
      alert("This feature is loading soon.");
    }
  };

  const sendPhoneOtp = async () => {
    if (!form.phone) return alert("Enter phone number first");
    try {
      await API.post("/users/send-phone-otp", { phone: form.phone });
      setOtpSent(true);
      alert("OTP sent to phone");
    } catch (err) {
      console.error(err);
      alert("This feature is loading soon.");
    }
  };

  const verifyPhoneOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const res = await API.post("/users/verify-phone-otp", { phone: form.phone, otp });
      if (res?.data?.verified) {
        alert("Phone verified");
        updateUser && updateUser({ phone: form.phone, phoneVerified: true });
        setOtp("");
        setOtpSent(false);
      } else {
        alert("This feature is loading soon.");
      }
    } catch (err) {
      console.error(err);
      alert("This feature is loading soon.");
    }
  };

  const startEmailChange = () => {
    setEmailChanging(true);
  };

  const sendEmailRecovery = async () => {
    if (!form.email) return alert("Enter email to recover/add");
    try {
      await API.post("/users/send-email-recovery", { email: form.email });
      alert("Recovery instructions sent to email (if supported by server)");
      setRecoveryMode(false);
    } catch (err) {
      console.error(err);
      alert("This feature is loading soon.");
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await API.put("/users/profile", form);
      if (res?.data) {
        updateUser && updateUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("This feature is loading soon.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      photoUrl: user?.photoUrl || "",
    });
    setOtpSent(false);
    setOtp("");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your identity, security, and public info.</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-200 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <div className="p-6 -mt-10">
                <div className="relative w-24 h-24 rounded-full bg-white ring-4 ring-white shadow flex items-center justify-center overflow-hidden">
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-gray-700 font-semibold">{initials}</span>
                  )}
                  <label
                    title="Change photo"
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <input type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} className="hidden" />
                  </label>
                </div>

                <div className="mt-4">
                  <div className="text-xl font-semibold">{form.name || "Your Name"}</div>
                  <div className="text-sm text-gray-500">{form.email || "email@example.com"}</div>
                  <div className="mt-3 text-sm text-gray-600">Phone: {form.phone || "Not provided"}</div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500">Profile completeness</div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-600"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{completeness}% complete</div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => { setRecoveryMode(true); sendEmailRecovery(); }}
                    className="text-sm text-gray-600 underline"
                  >
                    Recover or Verify Email
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await API.post("/users/verify-email");
                        updateUser && updateUser({ emailVerified: true });
                        alert("Email marked as verified.");
                      } catch (err) {
                        console.error(err);
                        alert("This feature is loading soon.");
                      }
                    }}
                    className="text-sm text-emerald-700 underline"
                  >
                    Verify Email
                  </button>
                  <button
                    onClick={startEmailChange}
                    className="text-sm text-blue-600 underline"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-5">
              <div className="text-sm text-gray-500">Quick Actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <label className="bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} className="hidden" />
                </label>
                <button
                  onClick={sendPhoneOtp}
                  className="px-3 py-2 rounded text-sm bg-blue-600 text-white"
                >
                  Send Phone OTP
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <span className="text-sm text-gray-500">Editable</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    disabled={!editing}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Photo URL</label>
                  <input
                    name="photoUrl"
                    value={form.photoUrl}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={onChange}
                    disabled={!editing}
                    className="w-full border p-2 rounded mt-1 min-h-[120px]"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    onClick={verifyPhoneOtp}
                    type="button"
                    className="bg-green-600 text-white px-4 rounded"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Security and Recovery</h2>
              <p className="text-sm text-gray-600 mt-1">
                Verify your phone and manage email recovery settings.
              </p>

              {emailChanging && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <h4 className="font-medium">Change Email</h4>
                  <p className="text-sm text-gray-600">Enter new email and click send. Server must implement /users/change-email.</p>
                  <div className="mt-2 flex flex-col md:flex-row gap-2">
                    <input value={form.email} name="email" onChange={onChange} className="flex-1 border p-2 rounded" />
                    <button
                      onClick={async () => {
                        try {
                          const res = await API.post("/users/change-email", { email: form.email });
                          if (res?.data?.email) {
                            setForm((prev) => ({ ...prev, email: res.data.email }));
                            updateUser && updateUser({ email: res.data.email, emailVerified: false });
                          }
                          alert("Change email request sent. Follow your email to confirm (if server supports it).");
                          setEmailChanging(false);
                        } catch (err) {
                          console.error(err);
                          alert("This feature is loading soon.");
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Send
                    </button>
                    <button onClick={() => setEmailChanging(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}

              {recoveryMode && (
                <div className="mt-4 p-4 border rounded bg-yellow-50">
                  <h4 className="font-medium">Recover Email</h4>
                  <p className="text-sm text-gray-600">Send recovery instructions to the email on file.</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={sendEmailRecovery} className="bg-orange-600 text-white px-4 py-2 rounded">Send Recovery</button>
                    <button onClick={() => setRecoveryMode(false)} className="bg-gray-200 px-4 py-2 rounded">Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
