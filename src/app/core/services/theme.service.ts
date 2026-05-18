import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'high-contrast';
export type Density = 'compact' | 'default' | 'comfortable';

const THEME_STORAGE_KEY = 'cs360-theme';
const DENSITY_STORAGE_KEY = 'cs360-density';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  // Reactive signals for theme state
  private _theme = signal<Theme>('light');
  private _density = signal<Density>('default');

  // Public readonly signals
  readonly theme = this._theme.asReadonly();
  readonly density = this._density.asReadonly();

  // Computed values for convenience
  readonly isDarkMode = computed(() => this._theme() === 'dark');
  readonly isHighContrast = computed(() => this._theme() === 'high-contrast');
  readonly isCompact = computed(() => this._density() === 'compact');
  readonly isComfortable = computed(() => this._density() === 'comfortable');

  constructor() {
    this.initializeFromStorage();
  }

  /**
   * Initialize theme and density from localStorage or system preference
   */
  private initializeFromStorage(): void {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedDensity = localStorage.getItem(DENSITY_STORAGE_KEY) as Density | null;

    if (storedTheme && ['light', 'dark', 'high-contrast'].includes(storedTheme)) {
      this.setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    if (storedDensity && ['compact', 'default', 'comfortable'].includes(storedDensity)) {
      this.setDensity(storedDensity);
    } else {
      this.setDensity('default');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /** Set the application theme — directly sets data-theme on <html> */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    const html = this.doc.documentElement;
    html.setAttribute('data-theme', theme);
    // Also toggle Tailwind dark class for any dark: utility classes
    if (theme === 'dark' || theme === 'high-contrast') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /** Set the UI density mode — directly sets data-density on <html> */
  setDensity(density: Density): void {
    this._density.set(density);
    this.doc.documentElement.setAttribute('data-density', density);
    localStorage.setItem(DENSITY_STORAGE_KEY, density);
  }

  /**
   * Toggle between light → dark → high-contrast → light
   */
  toggleTheme(): void {
    const current = this._theme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('high-contrast');
    } else {
      this.setTheme('light');
    }
  }

  /**
   * Cycle through density modes: compact → default → comfortable → compact
   */
  cycleDensity(): void {
    const current = this._density();
    if (current === 'compact') {
      this.setDensity('default');
    } else if (current === 'default') {
      this.setDensity('comfortable');
    } else {
      this.setDensity('compact');
    }
  }

  getAvailableThemes(): Theme[] {
    return ['light', 'dark', 'high-contrast'];
  }

  getAvailableDensities(): Density[] {
    return ['compact', 'default', 'comfortable'];
  }
}
