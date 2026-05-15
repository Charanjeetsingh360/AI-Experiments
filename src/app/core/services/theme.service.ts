import { Injectable, Renderer2, RendererFactory2, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export type Theme = 'light' | 'dark' | 'high-contrast';
export type Density = 'compact' | 'default' | 'comfortable';

const THEME_STORAGE_KEY = 'cs360-theme';
const DENSITY_STORAGE_KEY = 'cs360-density';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private renderer: Renderer2;

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

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeFromStorage();
  }

  /**
   * Initialize theme and density from localStorage or system preference
   */
  private initializeFromStorage(): void {
    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedDensity = localStorage.getItem(DENSITY_STORAGE_KEY) as Density | null;

    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    if (storedDensity) {
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

  /**
   * Set the application theme
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Also set Tailwind dark class for compatibility
    if (theme === 'dark') {
      this.renderer.addClass(this.document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
    }
  }

  /**
   * Set the UI density mode
   */
  setDensity(density: Density): void {
    this._density.set(density);
    this.renderer.setAttribute(this.document.documentElement, 'data-density', density);
    localStorage.setItem(DENSITY_STORAGE_KEY, density);
  }

  /**
   * Toggle between light and dark themes
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
   * Cycle through density modes
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

  /**
   * Get all available themes
   */
  getAvailableThemes(): Theme[] {
    return ['light', 'dark', 'high-contrast'];
  }

  /**
   * Get all available density modes
   */
  getAvailableDensities(): Density[] {
    return ['compact', 'default', 'comfortable'];
  }
}
