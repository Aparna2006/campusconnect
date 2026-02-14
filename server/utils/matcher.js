const calculateMatchScore = (userSkills, requiredSkills) => {
  if (!userSkills || !requiredSkills) return 0;

  const matchedSkills = requiredSkills.filter(skill =>
    userSkills.includes(skill)
  );

  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

module.exports = calculateMatchScore;
