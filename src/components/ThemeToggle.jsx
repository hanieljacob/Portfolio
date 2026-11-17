import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      <button
        type="button"
        onClick={() => setTheme('light')}
        data-active={theme === 'light'}
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
      >
        <Sun size={15} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        data-active={theme === 'dark'}
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon size={14} strokeWidth={1.8} />
      </button>
    </div>
  );
}
