import { createContext, useContext, useState } from "react";

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([
    {
      jobId: 1,
      role: "Frontend Developer",
      company: "TechCorp",
      status: "Interview",
      interviewDate: null,
      dateApplied: "2026-01-20",
      location: "Hyderabad",
      type: "Full-time",
    },
    {
      jobId: 2,
      role: "Data Analyst",
      company: "DataWorks",
      status: "Pending",
      interviewDate: null,
      dateApplied: "2026-01-28",
      location: "Remote",
      type: "Internship",
    },
    {
      jobId: 3,
      role: "Robotics Intern",
      company: "BuildBots",
      status: "Shortlisted",
      interviewDate: null,
      dateApplied: "2026-02-02",
      location: "Campus",
      type: "Internship",
    },
    {
      jobId: 4,
      role: "Backend Engineer",
      company: "GreenSoft",
      status: "Rejected",
      interviewDate: null,
      dateApplied: "2026-02-05",
      location: "Visakhapatnam",
      type: "Full-time",
    },
  ]);

  const applyToJob = (job) => {
    const alreadyApplied = applications.find(
      (app) => app.jobId === job.id
    );

    if (!alreadyApplied) {
      setApplications([
        ...applications,
        {
          jobId: job.id,
          role: job.role,
          company: job.company,
          status: "Applied",
          interviewDate: null,
          dateApplied: new Date().toISOString().slice(0, 10),
          location: job.location || "Not specified",
          type: job.type || "Job",
        },
      ]);
    }
  };

  const updateStatus = (jobId, newStatus, interviewDate = null) => {
    setApplications(
      applications.map((app) =>
        app.jobId === jobId
          ? { ...app, status: newStatus, interviewDate }
          : app
      )
    );
  };

  return (
    <ApplicationContext.Provider
      value={{ applications, applyToJob, updateStatus }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationContext);
