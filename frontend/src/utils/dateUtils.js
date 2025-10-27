/**
 * Calculate years of experience from a start date to present
 * Rounds up if more than 9 months into the next year
 * @param {string} startDate - Format: 'YYYY-MM-DD'
 * @returns {string} - Format: 'X+' years
 */
export const calculateYearsOfExperience = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  
  const yearsDiff = now.getFullYear() - start.getFullYear();
  const monthsDiff = now.getMonth() - start.getMonth();
  
  // Calculate total months of experience
  const totalMonths = (yearsDiff * 12) + monthsDiff;
  
  // If more than 9 months into the next year, round up
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  // Round up if 9+ months into next year
  const displayYears = remainingMonths >= 9 ? years + 1 : years;
  
  return `${displayYears}+`;
};

// Start date: February 2020 (First job at No Borders IT)
export const CAREER_START_DATE = '2020-02-01';

// Get current years of experience
export const getYearsOfExperience = () => calculateYearsOfExperience(CAREER_START_DATE);
