
export interface OptionItem {
    id: string;
    label: string;
    description?: string;
}

export const COLLABORATION_AREAS: OptionItem[] = [
    { id: 'product-development', label: 'Rozwój produktu/usługi' },
    { id: 'marketing-sales', label: 'Marketing i sprzedaż' },
    { id: 'technology', label: 'Technologia i rozwój' },
    { id: 'management', label: 'Zarządzanie i operacje' },
    { id: 'finance', label: 'Finanse i księgowość' },
    { id: 'design', label: 'Design i kreatywność' },
    { id: 'legal', label: 'Prawo i compliance' },
    { id: 'logistics', label: 'Logistyka i supply chain' },
    { id: 'content', label: 'Content i copywriting' },
    { id: 'analytics', label: 'Analityka danych' },
    { id: 'customer-service', label: 'Obsługa klienta' },
    { id: 'quality', label: 'Jakość i testowanie' }
];

export const EXPERIENCE_LEVELS: OptionItem[] = [
    { id: 'junior', label: 'Junior (0-2 lata)' },
    { id: 'mid', label: 'Mid (2-5 lat)' },
    { id: 'senior', label: 'Senior (5-10 lat)' },
    { id: 'expert', label: 'Expert (10+ lat)' },
    { id: 'any', label: 'Dowolny poziom' }
];

export const INDUSTRIES: OptionItem[] = [
    { id: 'technology', label: 'Technologia i IT' },
    { id: 'finance', label: 'Finanse i Księgowość' },
    { id: 'marketing', label: 'Marketing i Reklama' },
    { id: 'sales', label: 'Sprzedaż' },
    { id: 'design', label: 'Design i Kreatywność' },
    { id: 'management', label: 'Zarządzanie' },
    { id: 'consulting', label: 'Konsulting' },
    { id: 'education', label: 'Edukacja' },
    { id: 'healthcare', label: 'Zdrowie' },
    { id: 'other', label: 'Inne branże' }
];

export const WORK_MODES: OptionItem[] = [
    { id: 'remote', label: 'Zdalnie' },
    { id: 'hybrid', label: 'Hybrydowo' },
    { id: 'onsite', label: 'Stacjonarnie' },
    { id: 'flexible', label: 'Elastycznie' }
];

export const BUDGET_RANGES: OptionItem[] = [
    { id: 'up-to-50', label: 'Do 50 zł/h' },
    { id: '50-100', label: '50-100 zł/h' },
    { id: '100-200', label: '100-200 zł/h' },
    { id: '200-plus', label: '200+ zł/h' },
    { id: 'negotiable', label: 'Do uzgodnienia' }
];

export const PROJECT_TYPES: OptionItem[] = [
    { id: 'long-term', label: 'Długoterminowa współpraca' },
    { id: 'short-term', label: 'Projekt krótkoterminowy' },
    { id: 'one-time', label: 'Jednorazowe zlecenie' },
    { id: 'startup', label: 'Współpraca przy startupu' },
    { id: 'consulting', label: 'Freelancing/konsulting' }
];

export const TIME_COMMITMENTS: OptionItem[] = [
    { id: 'full-time', label: 'Pełny etat (40h/tydzień)' },
    { id: 'part-time', label: 'Część etatu (20-30h/tydzień)' },
    { id: 'project-based', label: 'Projektowo (10-20h/tydzień)' },
    { id: 'consultations', label: 'Konsultacje (5-10h/tydzień)' },
    { id: 'flexible', label: 'Elastycznie' }
];

export const findOptionById = (options: OptionItem[], id: string): OptionItem | undefined => {
    return options.find(option => option.id === id);
};

export const getOptionLabel = (options: OptionItem[], id: string): string => {
    const option = findOptionById(options, id);
    return option?.label || id;
};

export const getOptionLabels = (options: OptionItem[], ids: string[]): string[] => {
    return ids.map(id => getOptionLabel(options, id));
};