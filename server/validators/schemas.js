const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string()
    .valid("student", "recruiter", "club_coordinator")
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().max(128).required(),
});

const createOpportunitySchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  company: Joi.string().trim().max(120).allow(""),
  description: Joi.string().trim().min(10).required(),
  type: Joi.string().valid("internship", "hackathon", "event", "project", "job").required(),
  skillsRequired: Joi.array().items(Joi.string().trim()).default([]),
  location: Joi.string().trim().max(120).allow(""),
  logo: Joi.string().uri().allow("", null),
  deadline: Joi.date().allow(null),
});

const opportunityStatusSchema = Joi.object({
  status: Joi.string().valid("open", "closed", "interview_scheduled").required(),
  interviewDate: Joi.date().optional(),
  candidateEmail: Joi.string().email().optional(),
});

const createEventSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(10).required(),
  date: Joi.date().required(),
  venue: Joi.string().trim().max(120).allow(""),
});

const updateClubSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),
  description: Joi.string().trim().allow("").optional(),
  logo: Joi.string().uri().allow("").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createOpportunitySchema,
  opportunityStatusSchema,
  createEventSchema,
  updateClubSchema,
};
