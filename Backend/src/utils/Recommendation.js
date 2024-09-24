import { skillCategories } from "./Skills.js";

export const recommendSkills = (currentSkills) => {
  let recommendedSkills = new Set();
  let categoriesMatched = Object.keys(skillCategories).filter(category =>
    skillCategories[category].some(skill => currentSkills.includes(skill))
  );

  if(categoriesMatched.length === 1) categoriesMatched.push(categoriesMatched[0], categoriesMatched[0])
  if(categoriesMatched.length === 2) categoriesMatched.push(categoriesMatched[0], categoriesMatched[1])

  for (const category of categoriesMatched) {
    const overallSkills = [...currentSkills, ...recommendedSkills];
    const newSkill = skillCategories[category].find(skill => !overallSkills.includes(skill));
    if (newSkill && recommendedSkills.size < 3) {
      recommendedSkills.add(newSkill);
    }
  }

  if (recommendedSkills.size < 3) {
    const remainingCategories = Object.keys(skillCategories).filter(category => !categoriesMatched.includes(category));
    const randomCategory = remainingCategories[Math.floor(Math.random() * remainingCategories.length)];
    const randomSkills = skillCategories[randomCategory];

    randomSkills.forEach(skill => {
      if (!currentSkills.includes(skill) && recommendedSkills.size < 3) {
        recommendedSkills.add(skill);
      }
    });
  }

  return Array.from(recommendedSkills);
};