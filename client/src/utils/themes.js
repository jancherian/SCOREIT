// ScoreIt Minimal Theme System (Ice & Teal + Dark Arena)
const BASE_FONTS = {
    score: 'font-["Sora"] font-semibold tracking-tight',
    team: 'font-["Manrope"] font-semibold',
    body: 'font-["Manrope"]',
};

const BASE_UI = {
    scoreSize: 'text-[9rem] leading-none md:text-[12rem]',
    teamSize: 'text-4xl md:text-5xl',
    rounded: 'rounded-2xl',
    border: 'border',
    shadow: 'shadow-[0_10px_35px_rgba(2,12,27,0.08)]',
};

export const THEMES = {
    ice: {
        id: 'ice',
        name: 'Ice & Teal',
        description: 'Minimal, crisp, professional',
        fonts: BASE_FONTS,
        ui: BASE_UI,
        colors: {
            light: {
                bg: 'from-court-900 via-scoreit-950 to-court-900',
                card: 'bg-court-800/70',
                cardBorder: 'border-court-700',
                text: 'text-gray-100',
                textSecondary: 'text-gray-400',
                textMuted: 'text-gray-400',
                accent1: 'from-scoreit-500 to-glow-400',
                accent2: 'from-glow-400 to-scoreit-500',
                statusLive: 'bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] shadow-glow-orange',
                statusOther: 'bg-court-700 text-gray-200 px-3 py-1 rounded-full text-[11px] font-semibold border border-court-700',
            },
            dark: {
                bg: 'from-court-900 via-scoreit-950 to-court-900',
                card: 'bg-court-800/70',
                cardBorder: 'border-court-700',
                text: 'text-gray-100',
                textSecondary: 'text-gray-400',
                textMuted: 'text-gray-400',
                accent1: 'from-scoreit-500 to-glow-400',
                accent2: 'from-glow-400 to-scoreit-500',
                statusLive: 'bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] shadow-glow-orange',
                statusOther: 'bg-court-700 text-gray-200 px-3 py-1 rounded-full text-[11px] font-semibold border border-court-700',
            }
        }
    },
    arena: {
        id: 'arena',
        name: 'Dark Arena',
        description: 'Focused, low-glare, premium',
        fonts: BASE_FONTS,
        ui: {
            ...BASE_UI,
            shadow: 'shadow-[0_16px_45px_rgba(0,0,0,0.35)]',
        },
        colors: {
            light: {
                bg: 'from-court-900 via-scoreit-950 to-court-900',
                card: 'bg-court-800/70',
                cardBorder: 'border-court-700',
                text: 'text-gray-100',
                textSecondary: 'text-gray-400',
                textMuted: 'text-gray-400',
                accent1: 'from-scoreit-500 to-glow-400',
                accent2: 'from-glow-400 to-scoreit-500',
                statusLive: 'bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] shadow-glow-orange',
                statusOther: 'bg-court-700 text-gray-200 px-3 py-1 rounded-full text-[11px] font-semibold border border-court-700',
            },
            dark: {
                bg: 'from-court-900 via-scoreit-950 to-court-900',
                card: 'bg-court-800/70',
                cardBorder: 'border-court-700',
                text: 'text-gray-100',
                textSecondary: 'text-gray-400',
                textMuted: 'text-gray-400',
                accent1: 'from-scoreit-500 to-glow-400',
                accent2: 'from-glow-400 to-scoreit-500',
                statusLive: 'bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] shadow-glow-orange',
                statusOther: 'bg-court-700 text-gray-200 px-3 py-1 rounded-full text-[11px] font-semibold border border-court-700',
            }
        }
    },
};

export const getTheme = (themeId) => {
    return THEMES[themeId] || THEMES.normal;
};

export const getAllThemes = () => {
    return Object.values(THEMES);
};

export const SPORT_THEME_MAP = {
    football: 'ice',
    cricket: 'ice',
    basketball: 'ice',
    volleyball: 'ice',
    hockey: 'ice',
};

export const getThemeForSport = (sportId) => {
    return SPORT_THEME_MAP[sportId] || 'normal';
};
