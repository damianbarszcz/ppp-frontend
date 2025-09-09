// constants/mentorProfileConstants.ts

export interface OptionItem {
    id: string;
    label: string;
    description?: string;
}

export const EXPERTISE_AREAS: OptionItem[] = [
    { id: 'software-development', label: 'Rozwój oprogramowania' },
    { id: 'product-management', label: 'Zarządzanie produktem' },
    { id: 'project-management', label: 'Zarządzanie projektami' },
    { id: 'team-leadership', label: 'Przywództwo i zarządzanie zespołem' },
    { id: 'business-strategy', label: 'Strategia biznesowa' },
    { id: 'marketing', label: 'Marketing i promocja' },
    { id: 'sales', label: 'Sprzedaż i rozwój biznesu' },
    { id: 'design', label: 'Design i UX/UI' },
    { id: 'data-science', label: 'Data Science i analityka' },
    { id: 'devops', label: 'DevOps i infrastruktura' },
    { id: 'entrepreneurship', label: 'Przedsiębiorczość' },
    { id: 'career-development', label: 'Rozwój kariery' }
];

export const INDUSTRIES: OptionItem[] = [
    { id: 'technology', label: 'Technologia i IT' },
    { id: 'fintech', label: 'FinTech' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'healthcare', label: 'Ochrona zdrowia' },
    { id: 'finance', label: 'Finanse i bankowość' },
    { id: 'education', label: 'Edukacja' },
    { id: 'media', label: 'Media i rozrywka' },
    { id: 'automotive', label: 'Motoryzacja' },
    { id: 'real-estate', label: 'Nieruchomości' },
    { id: 'consulting', label: 'Konsulting' },
    { id: 'startup', label: 'Startupy' },
    { id: 'other', label: 'Inne branże' }
];

export const SKILLS: OptionItem[] = [
    // Techniczne
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'react', label: 'React' },
    { id: 'nodejs', label: 'Node.js' },
    { id: 'sql', label: 'SQL' },
    { id: 'aws', label: 'AWS' },
    { id: 'docker', label: 'Docker' },

    // Biznesowe
    { id: 'agile', label: 'Agile/Scrum' },
    { id: 'product-strategy', label: 'Strategia produktu' },
    { id: 'market-research', label: 'Badania rynku' },
    { id: 'seo', label: 'SEO' },
    { id: 'google-ads', label: 'Google Ads' },
    { id: 'analytics', label: 'Google Analytics' },

    // Soft skills
    { id: 'communication', label: 'Komunikacja' },
    { id: 'negotiation', label: 'Negocjacje' },
    { id: 'presentation', label: 'Prezentacje' },
    { id: 'coaching', label: 'Coaching' }
];

export const TECHNOLOGIES: OptionItem[] = [
    { id: 'react', label: 'React' },
    { id: 'angular', label: 'Angular' },
    { id: 'vue', label: 'Vue.js' },
    { id: 'nodejs', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C#' },
    { id: 'php', label: 'PHP' },
    { id: 'aws', label: 'AWS' },
    { id: 'azure', label: 'Microsoft Azure' },
    { id: 'docker', label: 'Docker' },
    { id: 'kubernetes', label: 'Kubernetes' },
    { id: 'mongodb', label: 'MongoDB' },
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'figma', label: 'Figma' },
    { id: 'adobe-cc', label: 'Adobe Creative Cloud' }
];

export const TARGET_AUDIENCE: OptionItem[] = [
    { id: 'junior', label: 'Junior (0-2 lata)', description: 'Początkujący w branży' },
    { id: 'mid', label: 'Mid (2-5 lat)', description: 'Średnie doświadczenie' },
    { id: 'senior', label: 'Senior (5+ lat)', description: 'Zaawansowani specjaliści' },
    { id: 'career-change', label: 'Zmiana kariery', description: 'Osoby zmieniające branżę' },
    { id: 'students', label: 'Studenci', description: 'Osoby kończące studia' },
    { id: 'entrepreneurs', label: 'Przedsiębiorcy', description: 'Założyciele startupów' }
];

export const MENTORING_TOPICS: OptionItem[] = [
    { id: 'career-planning', label: 'Planowanie kariery' },
    { id: 'skill-development', label: 'Rozwój umiejętności' },
    { id: 'job-search', label: 'Poszukiwanie pracy' },
    { id: 'interview-prep', label: 'Przygotowanie do rozmów' },
    { id: 'salary-negotiation', label: 'Negocjacje wynagrodzenia' },
    { id: 'leadership', label: 'Rozwój przywództwa' },
    { id: 'team-management', label: 'Zarządzanie zespołem' },
    { id: 'work-life-balance', label: 'Work-life balance' },
    { id: 'networking', label: 'Budowanie sieci kontaktów' },
    { id: 'personal-branding', label: 'Personal branding' },
    { id: 'startup-advice', label: 'Doradztwo dla startupów' },
    { id: 'tech-trends', label: 'Trendy technologiczne' },
    { id: 'project-management', label: 'Zarządzanie projektami' },
    { id: 'code-review', label: 'Code review i best practices' }
];

export const YEARS_OF_EXPERIENCE_OPTIONS = Array.from({length: 51}, (_, i) => ({
    id: i.toString(),
    label: i === 0 ? 'Brak doświadczenia' : i === 1 ? '1 rok' : `${i} lat`
}));