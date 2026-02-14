import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const getInitialSettings = (user) => ({
  emailNotifications: user?.settings?.emailNotifications ?? true,
  smsNotifications: user?.settings?.smsNotifications ?? false,
  pushNotifications: user?.settings?.pushNotifications ?? true,
  weeklyDigest: user?.settings?.weeklyDigest ?? true,
  applicationAlerts: user?.settings?.applicationAlerts ?? true,
  profileVisibility: user?.settings?.profileVisibility ?? "campus",
  showProfilePublic: user?.settings?.showProfilePublic ?? true,
  searchableByRecruiters: user?.settings?.searchableByRecruiters ?? true,
  twoFactor: user?.settings?.twoFactor ?? false,
  theme: user?.settings?.theme ?? "system",
  language: user?.settings?.language ?? "en",
  timezone:
    user?.settings?.timezone ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    "UTC",
});

const getPasswordScore = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <input
        type="checkbox"
        className="h-5 w-5 mt-1 accent-blue-600"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function Settings() {
  const { user, updateUser } = useContext(AuthContext);

  const [settings, setSettings] = useState(() => getInitialSettings(user));
  const [savedSettings, setSavedSettings] = useState(() => getInitialSettings(user));
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const baseSettings = useMemo(() => savedSettings, [savedSettings]);
  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(baseSettings);

  const passwordScore = getPasswordScore(passwords.next);
  const passwordLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
    Math.max(passwordScore - 1, 0)
  ];
  const passwordMatch =
    passwords.next.length > 0 && passwords.next === passwords.confirm;

  const updateSetting = (key, value) => {
    setSaveMessage("");
    setSettings((previous) => ({ ...previous, [key]: value }));
    if (key === "theme") {
      const resolved =
        value === "system"
          ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : value;
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute("data-theme-preference", value);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const response = await API.put("/users/settings", settings);
      const savedSettings = response?.data || settings;
      setSettings(savedSettings);
      setSavedSettings(savedSettings);
      updateUser({ settings: savedSettings });
      setSaveMessage("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      setSaveMessage("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    setSettings(baseSettings);
    const resolved =
      baseSettings.theme === "system"
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : baseSettings.theme;
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-preference", baseSettings.theme);
    setSaveMessage("Changes reverted.");
  };

  const changePassword = async () => {
    setPasswordMessage("");
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordMessage("Fill all password fields.");
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      await API.post("/users/change-password", {
        current: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordMessage("Password updated.");
    } catch (error) {
      console.error(error);
      setPasswordMessage(
        "Could not update password with backend. Please verify endpoint support."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      await API.delete("/users/me");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setDeleting(false);
      alert("Failed to delete account. Check backend endpoint /users/me.");
    }
  };

  const userInitials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Settings</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage account security, privacy, notifications, and experience preferences.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetChanges}
                disabled={!hasUnsavedChanges || saving}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={saveSettings}
                disabled={!hasUnsavedChanges || saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          {saveMessage ? (
            <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {saveMessage}
            </p>
          ) : null}
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              <p className="mt-1 text-sm text-gray-500">
                Control how CampusConnect looks and behaves for your account.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(event) => updateSetting("theme", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <select
                    value={settings.language}
                    onChange={(event) => updateSetting("language", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <input
                    value={settings.timezone}
                    onChange={(event) => updateSetting("timezone", event.target.value)}
                    placeholder="e.g., Asia/Kolkata"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <div className="mt-5 space-y-3">
                <ToggleRow
                  title="Email notifications"
                  description="Receive updates on opportunities, application changes, and events."
                  checked={settings.emailNotifications}
                  onChange={(value) => updateSetting("emailNotifications", value)}
                />
                <ToggleRow
                  title="SMS notifications"
                  description="Get urgent alerts through text messages."
                  checked={settings.smsNotifications}
                  onChange={(value) => updateSetting("smsNotifications", value)}
                />
                <ToggleRow
                  title="Push notifications"
                  description="Enable browser push for real-time updates."
                  checked={settings.pushNotifications}
                  onChange={(value) => updateSetting("pushNotifications", value)}
                />
                <ToggleRow
                  title="Weekly digest"
                  description="Receive a weekly summary of top opportunities and stats."
                  checked={settings.weeklyDigest}
                  onChange={(value) => updateSetting("weeklyDigest", value)}
                />
                <ToggleRow
                  title="Application alerts"
                  description="Get alerts when your application status changes."
                  checked={settings.applicationAlerts}
                  onChange={(value) => updateSetting("applicationAlerts", value)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Profile Visibility</label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(event) =>
                      updateSetting("profileVisibility", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="private">Only me</option>
                    <option value="campus">Campus only</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <ToggleRow
                  title="Public profile page"
                  description="Allow others to view your public profile link."
                  checked={settings.showProfilePublic}
                  onChange={(value) => updateSetting("showProfilePublic", value)}
                />
                <ToggleRow
                  title="Recruiter search"
                  description="Allow recruiters to discover your profile by skills."
                  checked={settings.searchableByRecruiters}
                  onChange={(value) => updateSetting("searchableByRecruiters", value)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              <div className="mt-5 space-y-4">
                <ToggleRow
                  title="Two-factor authentication"
                  description="Adds one extra verification step during sign in."
                  checked={settings.twoFactor}
                  onChange={(value) => updateSetting("twoFactor", value)}
                />

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(event) =>
                        setPasswords((prev) => ({
                          ...prev,
                          current: event.target.value,
                        }))
                      }
                      placeholder="Current password"
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(event) =>
                        setPasswords((prev) => ({
                          ...prev,
                          next: event.target.value,
                        }))
                      }
                      placeholder="New password"
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(event) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: event.target.value,
                        }))
                      }
                      placeholder="Confirm new password"
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {passwords.next ? (
                    <p className="mt-2 text-xs text-gray-500">
                      Strength: <span className="font-semibold">{passwordLabel}</span>
                      {passwords.confirm
                        ? passwordMatch
                          ? " | Passwords match"
                          : " | Passwords do not match"
                        : ""}
                    </p>
                  ) : null}
                  {passwordMessage ? (
                    <p className="mt-2 text-sm text-blue-700">{passwordMessage}</p>
                  ) : null}
                  <button
                    onClick={changePassword}
                    disabled={changingPassword}
                    className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {userInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || "Student"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Edit profile details
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Connected Accounts</h3>
              <p className="mt-1 text-sm text-gray-500">
                Integration UI is ready for OAuth backend hooks.
              </p>
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50">
                  Connect Google
                </button>
                <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50">
                  Connect GitHub
                </button>
                <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50">
                  Connect LinkedIn
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <h3 className="font-semibold text-red-700">Danger Zone</h3>
              <p className="mt-2 text-sm text-red-700">
                Type <span className="font-bold">DELETE</span> to permanently remove your account.
              </p>
              <input
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                className="mt-3 w-full rounded-lg border border-red-300 bg-white px-3 py-2 focus:border-red-500 focus:outline-none"
                placeholder="Type DELETE"
              />
              <button
                onClick={deleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleting}
                className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
}

export default Settings;
