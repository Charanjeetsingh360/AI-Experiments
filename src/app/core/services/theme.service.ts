import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'soothing-dark' | 'high-contrast';
export type Density = 'compact' | 'default' | 'comfortable';

const THEME_STORAGE_KEY = 'cs360-theme';
const DENSITY_STORAGE_KEY = 'cs360-density';
const THEMES: Theme[] = ['light', 'soothing-dark', 'high-contrast'];
const DENSITIES: Density[] = ['compact', 'default', 'comfortable'];

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
  readonly isDarkMode = computed(() => this._theme() === 'soothing-dark');
  readonly isHighContrast = computed(() => this._theme() === 'high-contrast');
  readonly isCompact = computed(() => this._density() === 'compact');
  readonly isComfortable = computed(() => this._density() === 'comfortable');

  constructor() {
    this.initializeFromStorage();
  }

  /**
   * Initialize theme and density from localStorage.
   */
  private initializeFromStorage(): void {
    const storedTheme = this.normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
    const storedDensity = this.normalizeDensity(localStorage.getItem(DENSITY_STORAGE_KEY));

    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      this.setTheme('light');
    }

    if (storedDensity) {
      this.setDensity(storedDensity);
    } else {
      this.setDensity('default');
    }
  }

  /** Set the application theme — directly sets data-theme on <html> */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    const html = this.doc.documentElement;
    html.setAttribute('data-theme', theme);
    // Also toggle Tailwind dark class for any dark: utility classes
    if (theme === 'soothing-dark' || theme === 'high-contrast') {
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
   * Toggle between light → soothing dark → high-contrast → light
   */
  toggleTheme(): void {
    const current = this._theme();
    if (current === 'light') {
      this.setTheme('soothing-dark');
    } else if (current === 'soothing-dark') {
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
    return [...THEMES];
  }

  getAvailableDensities(): Density[] {
    return [...DENSITIES];
  }

  private normalizeTheme(value: string | null): Theme | null {
    if (value === 'light' || value === 'high-contrast') {
      return value;
    }

    if (value === 'dark' || value === 'soothing-dark') {
      return 'soothing-dark';
    }

    return null;
  }

  private normalizeDensity(value: string | null): Density | null {
    if (value === 'compact' || value === 'default' || value === 'comfortable') {
      return value;
    }

    if (value === 'small') {
      return 'compact';
    }

    if (value === 'medium' || value === 'normal') {
      return 'default';
    }

    if (value === 'large') {
      return 'comfortable';
    }

    return null;
  }
}
