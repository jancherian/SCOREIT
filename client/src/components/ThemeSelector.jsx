import { useTheme } from '../context/ThemeContext';
import { getAllThemes } from '../utils/themes';

function ThemeSelector() {
    const { themeId, setThemeId, themeMode, setThemeMode } = useTheme();
    const themes = getAllThemes();
    const selectValue = themeMode === 'auto' ? 'auto' : themeId;

    return (
        <div className="relative">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-surface hover:border-border-strong">
                <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <select
                    value={selectValue}
                    onChange={(e) => {
                        const nextValue = e.target.value;
                        if (nextValue === 'auto') {
                            setThemeMode('auto');
                            return;
                        }
                        setThemeMode('manual');
                        setThemeId(nextValue);
                    }}
                    className="bg-transparent text-primary focus:outline-none cursor-pointer pr-2"
                >
                    <option value="auto" className="bg-surface">
                        Auto (by sport)
                    </option>
                    {themes.map((theme) => (
                        <option key={theme.id} value={theme.id} className="bg-surface">
                            {theme.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default ThemeSelector;
