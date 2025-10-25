import { getYearsOfExperience } from '../utils/dateUtils';

export const experienceData = [
  {
    id: 1,
    position: 'Senior Software Engineer',
    company: 'Adventure Dhaka Limited',
    companyWebsite: 'https://adventuredhaka.com',
    location: 'Dhaka, Bangladesh',
    period: 'April 2023 - Present',
    duration: '1+ years',
    employmentType: 'Full-time',
    description: 'Designing and implementing scalable microservices to improve system performance and maintainability. Leading feature planning and promoting clean architecture.',
    achievements: [
      'Designed and implemented scalable microservices to improve system performance and maintainability',
      'Architected and containerized services for seamless deployment using Docker and Kubernetes',
      'Optimized cloud scalability and efficiency across distributed systems',
      'Collaborated with frontend and mobile development teams to ensure smooth API integration',
      'Led feature planning and system design discussions',
      'Promoted clean architecture and agile workflows across the development team'
    ],
    responsibilities: [
      'Design and implement scalable microservices architecture',
      'Containerize services using Docker and Kubernetes',
      'Lead feature planning and system design discussions',
      'Ensure end-to-end feature delivery with cross-functional teams',
      'Promote clean architecture and agile development practices'
    ],
    technologies: ['Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Microservices', 'REST API', 'Git'],
    icon: '💼'
  },
  {
    id: 2,
    position: 'Software Engineer',
    company: 'Workspace InfoTech Limited',
    companyWebsite: 'https://workspaceinfotech.com',
    location: 'Dhaka, Bangladesh',
    period: 'November 2020 - March 2023',
    duration: '2+ years',
    employmentType: 'Full-time',
    description: 'Developed and maintained stable web applications with improved user experience. Contributed to both backend and frontend development as part of a collaborative team.',
    achievements: [
      'Developed and maintained stable web applications with improved user experience',
      'Delivered client-requested features with careful testing and code reviews',
      'Diagnosed and resolved performance issues, improving overall reliability and efficiency',
      'Contributed to both backend and frontend development',
      'Worked as part of a collaborative, cross-functional team',
      'Maintained high code quality standards through peer reviews'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Implement client-requested features',
      'Conduct code reviews and testing',
      'Diagnose and resolve performance issues',
      'Collaborate with cross-functional teams'
    ],
    technologies: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'Vue.js', 'REST API', 'Git'],
    icon: '🚀'
  },
  {
    id: 3,
    position: 'Web Developer Intern',
    company: 'No Borders IT',
    companyWebsite: 'https://nobordersit.com',
    location: 'Dhaka, Bangladesh',
    period: 'February 2020 - May 2020',
    duration: '4 months',
    employmentType: 'Internship',
    description: 'Enhanced UI/UX for B2B and B2C travel platforms. Integrated external APIs and supported development and QA processes.',
    achievements: [
      'Enhanced UI/UX for B2B and B2C travel platforms to improve user experience',
      'Integrated external APIs for booking functionality',
      'Supported development and QA processes',
      'Helped maintain responsive UI across different devices',
      'Contributed ideas during client review and design sessions',
      'Learned industry best practices for travel technology platforms'
    ],
    responsibilities: [
      'Enhance UI/UX for travel platforms',
      'Integrate external booking APIs',
      'Support development and QA testing',
      'Maintain responsive user interfaces',
      'Participate in client reviews and design sessions'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'API Integration', 'Bootstrap'],
    icon: '🌱'
  }
];

// Additional work experience details
export const freelanceExperience = {
  title: 'Freelance Developer',
  period: '2019 - Present',
  description: 'Working on freelance projects during spare time, building custom solutions for clients worldwide.',
  projects: [
    {
      name: 'E-commerce Platform',
      client: 'Local Business',
      description: 'Built complete e-commerce solution with Laravel',
      technologies: ['Laravel', 'Vue.js', 'MySQL']
    },
    {
      name: 'Booking Management System',
      client: 'Tourism Company',
      description: 'Developed booking system for tour packages',
      technologies: ['PHP', 'MySQL', 'JavaScript']
    },
    {
      name: 'School Management System',
      client: 'Educational Institute',
      description: 'Complete school management with student, teacher, and admin panels',
      technologies: ['Laravel', 'Bootstrap', 'MySQL']
    }
  ]
};

// Professional summary
export const professionalSummary = {
  totalExperience: getYearsOfExperience(),
  specialization: 'Full Stack Web Development',
  expertise: [
    'Laravel & PHP Backend Development',
    'React & Vue.js Frontend Development',
    'RESTful API Design & Development',
    'Database Design & Optimization',
    'Mobile App Development (Kotlin)',
    'DevOps & CI/CD Implementation'
  ],
  projectsCompleted: '50+',
  clientsSatisfied: '30+',
  currentFocus: [
    'Building scalable microservices',
    'Cloud infrastructure (AWS)',
    'Modern JavaScript frameworks',
    'Performance optimization'
  ]
};
