export interface Skill {
  name: string
  category: 'Frontend' | 'Backend' | 'Tools' | 'Other'
}

export const skills: Skill[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TanStack', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'HTML / CSS', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },

  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Backend' },
  { name: 'MongoDB', category: 'Backend' },
  { name: 'Redis', category: 'Backend' },
  { name: 'Go', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },

  { name: 'Git', category: 'Tools' },
  { name: 'Docker', category: 'Tools' },
  { name: 'Linux', category: 'Tools' },
  { name: 'VS Code', category: 'Tools' },
  { name: 'Figma', category: 'Tools' },
  { name: 'CI/CD', category: 'Tools' },
]
