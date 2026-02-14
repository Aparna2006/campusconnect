const Opportunity = require("../models/Opportunity");
const calculateMatchScore = require("../utils/matcher");
const logActivity = require("../utils/activityLogger");
const { sendEmail } = require("../utils/emailService");
const { getIO } = require("../socket");

// CREATE OPPORTUNITY
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, type, skillsRequired, company, location, logo, deadline } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      type,
      skillsRequired,
      company: company || "Campus Organization",
      location: location || "On-campus",
      logo: logo || null,
      deadline: deadline || null,
      createdBy: req.user._id,
    });

    await logActivity({
      userId: req.user._id,
      action: "Created opportunity",
      metadata: { opportunityId: opportunity._id, type: opportunity.type },
      ipAddress: req.ip,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL OPPORTUNITIES
exports.getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "name email")
      .sort({ postedAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPLY TO OPPORTUNITY
exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    if (opportunity.status === "closed") {
      return res.status(400).json({ message: "Opportunity is closed" });
    }

    opportunity.applicants.push(req.user._id);
    await opportunity.save();

    await logActivity({
      userId: req.user._id,
      action: "Applied for opportunity",
      metadata: { opportunityId: opportunity._id, title: opportunity.title },
      ipAddress: req.ip,
    });

    await sendEmail({
      to: req.user.email,
      subject: "Application Received",
      text: `Your application for "${opportunity.title}" was received.`,
    });

    res.json({ message: "Applied successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE OPPORTUNITY STATUS (Recruiter only)
exports.updateOpportunityStatus = async (req, res) => {
  try {
    const { status, interviewDate, candidateEmail } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    opportunity.status = status;
    opportunity.interviewDate = interviewDate || null;
    await opportunity.save();

    await logActivity({
      userId: req.user._id,
      action: "Updated opportunity status",
      metadata: { opportunityId: opportunity._id, status },
      ipAddress: req.ip,
    });

    if (status === "interview_scheduled" && candidateEmail) {
      await sendEmail({
        to: candidateEmail,
        subject: "Interview Scheduled",
        text: `Interview scheduled for "${opportunity.title}" on ${interviewDate || "upcoming date"}.`,
      });
    }

    const io = getIO();
    if (io) {
      io.emit("interview:status", {
        opportunityId: opportunity._id,
        title: opportunity.title,
        status: opportunity.status,
        interviewDate: opportunity.interviewDate,
      });
    }

    return res.json({
      message: "Opportunity status updated",
      status: opportunity.status,
      interviewDate: opportunity.interviewDate,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// RECOMMENDED OPPORTUNITIES
exports.getRecommendedOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .sort({ postedAt: -1 });

    const recommendations = opportunities.map((opp) => ({
      ...opp._doc,
      matchPercentage: calculateMatchScore(
        req.user.skills || [],
        opp.skillsRequired || []
      ),
    }));

    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEED DATA - Create sample opportunities
exports.seedOpportunities = async (req, res) => {
  try {
    // Check if opportunities already exist
    const count = await Opportunity.countDocuments();
    if (count > 0) {
      return res.json({ message: `Already ${count} opportunities in database. Skipping seed.` });
    }

    const sampleOpportunities = [
      {
        title: "Frontend Intern",
        company: "Google",
        description: "Join our team to build amazing web experiences. Work with React, TypeScript, and modern web technologies.",
        type: "internship",
        location: "Mountain View, CA / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Google_Logo.png",
        skillsRequired: ["JavaScript", "React", "CSS"],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Backend Developer",
        company: "Microsoft",
        description: "Build scalable backend services using Node.js and cloud technologies. Ideal for passionate developers.",
        type: "job",
        location: "Seattle, WA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        skillsRequired: ["Node.js", "Python", "Database Design"],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Full Stack Development",
        company: "Amazon",
        description: "Develop full-stack applications with React and Django. Work on high-impact projects.",
        type: "internship",
        location: "Seattle, WA / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        skillsRequired: ["React", "Python", "Django"],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: "HackFest 2026",
        company: "Campus Tech Club",
        description: "48-hour hackathon where you can build innovative projects. Cash prizes and internship opportunities!",
        type: "hackathon",
        location: "On-campus",
        logo: null,
        skillsRequired: ["Any"],
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Data Science Intern",
        company: "Facebook",
        description: "Work on machine learning projects at scale. Analyze billions of data points to improve user experiences.",
        type: "internship",
        location: "Menlo Park, CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_logo_%282019%29.png",
        skillsRequired: ["Python", "Machine Learning", "SQL"],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Mobile App Developer",
        company: "Apple",
        description: "Create delightful iOS apps. Learn from the best in the industry.",
        type: "job",
        location: "Cupertino, CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        skillsRequired: ["Swift", "iOS", "UI/UX"],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        title: "DevOps Engineer",
        company: "Netflix",
        description: "Scale infrastructure to serve millions. Work with Kubernetes, Docker, and cloud platforms.",
        type: "job",
        location: "Los Gatos, CA / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        skillsRequired: ["Docker", "Kubernetes", "Cloud", "Linux"],
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      },
      {
        title: "AI/ML Researcher",
        company: "OpenAI",
        description: "Push the boundaries of artificial intelligence. Work on cutting-edge research.",
        type: "job",
        location: "San Francisco, CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
        skillsRequired: ["Python", "Machine Learning", "Data Science"],
        deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      },
      {
        title: "QA Engineer",
        company: "LinkedIn",
        description: "Ensure quality at scale. Test features used by millions worldwide.",
        type: "internship",
        location: "Sunnyvale, CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
        skillsRequired: ["Testing", "Automation", "JavaScript"],
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        title: "UI/UX Designer",
        company: "Airbnb",
        description: "Design beautiful and intuitive user experiences. Shape the future of travel.",
        type: "internship",
        location: "San Francisco, CA / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Airbnb_logo.svg",
        skillsRequired: ["UI/UX", "Design", "Figma"],
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Software Engineer",
        company: "Tesla",
        description: "Build autonomous driving software. Work on cutting-edge automotive technology.",
        type: "job",
        location: "Palo Alto, CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
        skillsRequired: ["C++", "Python", "Robotics"],
        deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Campus Ambassador Program",
        company: "GitHub",
        description: "Represent GitHub on your campus. Free resources, training, and networking opportunities.",
        type: "event",
        location: "On-campus",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
        skillsRequired: ["Any"],
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    ];

    await Opportunity.insertMany(sampleOpportunities);
    res.status(201).json({ message: `Created ${sampleOpportunities.length} sample opportunities` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
