import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme, Density } from '../../../core/services/theme.service';
import { CSIconComponent } from '../cs-icon/cs-icon.component';
import { CSFlyoutComponent } from '../cs-flyout/cs-flyout.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, CSIconComponent, CSFlyoutComponent],
  template: `
    <header class="topbar">
      <button type="button" class="mobile-menu-btn" (click)="toggleSidebar.emit()" aria-label="Open navigation">
        <cs-icon name="menu" [size]="24" aria-hidden="true" />
      </button>

      <!-- Left: Breadcrumb navigation -->
      <nav class="topbar-breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-item">Home</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item">Calendar</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item breadcrumb-item--current">View</span>
      </nav>

      <!-- Ongoing Shift Card — tappable card matching Figma node 3954-168038 -->
      <button type="button" class="shift-card" aria-label="Ongoing shift: Marry Edison, Clock-In at 2:05 PM">
        <div class="shift-avatar">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0M0QTg4MiIvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjUiIGZpbGw9IiNENEE4ODQiLz4KICA8ZWxsaXBzZSBjeD0iMTIiIGN5PSIyMiIgcng9IjgiIHJ5PSI2IiBmaWxsPSIjOEI2OTE0Ii8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSI5LjUiIHI9IjEiIGZpbGw9IiMzRDJCMUYiLz4KICA8Y2lyY2xlIGN4PSIxNCIgY3k9IjkuNSIgcj0iMSIgZmlsbD0iIzNEMkIxRiIvPgogIDxwYXRoIGQ9Ik0xMCAxMi41IFExMiAxNCAxNCAxMi41IiBzdHJva2U9IiM4QjYzNDgiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=" alt="Marry Edison" />
        </div>
        <div class="shift-info">
          <span class="shift-name">Marry, Edison</span>
          <span class="shift-clock">Clock-In at 2:05 PM</span>
        </div>
        <span class="btn-clock-out" role="button" tabindex="0" aria-label="Clock out">
          Clock-Out
        </span>
      </button>

      <!-- Spacer: pushes actions to right -->
      <div class="topbar-spacer"></div>

      <!-- Right: Actions -->
      <div class="topbar-right">
        <button type="button" class="btn-adhoc-shift" aria-label="Add adhoc shift">
          + Adhoc Shift
        </button>

        <button class="icon-btn" aria-label="Notifications">
          <cs-icon name="notifications" [size]="20" />
        </button>

        <button type="button" class="user-avatar" aria-label="Open profile" (click)="openProfile()">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDM0IDM0Ij4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE3IiByPSIxNyIgZmlsbD0iI0I4OTY3QSIvPgogIDxjaXJjbGUgY3g9IjE3IiBjeT0iMTUiIHI9IjcuNSIgZmlsbD0iI0Q3OUU4QiIvPgogIDxlbGxpcHNlIGN4PSIxNyIgY3k9IjMyIiByeD0iMTIiIHJ5PSI4IiBmaWxsPSIjN0E1NTQwIi8+CiAgPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMS41IiBmaWxsPSIjM0QyQjFGIi8+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIxNCIgcj0iMS41IiBmaWxsPSIjM0QyQjFGIi8+CiAgPHBhdGggZD0iTTE0IDE4LjUgUTE3IDIxIDIwIDE4LjUiIHN0cm9rZT0iIzhCNjM0OCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" alt="User" />
        </button>
      </div>
    </header>

    <cs-flyout
      [isOpen]="isProfileOpen"
      (isOpenChange)="isProfileOpen = $event"
      position="right"
      width="500px"
      ariaLabel="Profile"
      [showHeaderBorder]="false"
      headerPadding="none"
      bodyPadding="none"
      footerPadding="none"
    >
      <div flyout-header class="profile-header">
        <button type="button" class="profile-icon-button" aria-label="Back" (click)="closeProfile()">
          <cs-icon name="west" [size]="24" aria-hidden="true" />
        </button>
        <h2>Profile</h2>
        <button type="button" class="profile-icon-button" aria-label="Close profile" (click)="closeProfile()">
          <cs-icon name="close" [size]="22" aria-hidden="true" />
        </button>
      </div>

      <div flyout-body class="profile-panel">
        <section class="profile-section profile-section--user" aria-labelledby="profile-user-title">
          <div class="profile-identity">
            <div class="profile-avatar-large">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgdmlld0JveD0iMCAwIDcwIDcwIj48Y2lyY2xlIGN4PSIzNSIgY3k9IjM1IiByPSIzNSIgZmlsbD0iI0I4OTY3QSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMzAiIHI9IjE2IiBmaWxsPSIjRDc5RThCIi8+PGVsbGlwc2UgY3g9IjM1IiBjeT0iNjgiIHJ4PSIyNCIgcnk9IjE2IiBmaWxsPSIjN0E1NTQwIi8+PGNpcmNsZSBjeD0iMjkiIGN5PSIyOCIgcj0iMyIgZmlsbD0iIzNEMkIxRiIvPjxjaXJjbGUgY3g9IjQxIiBjeT0iMjgiIHI9IjMiIGZpbGw9IiMzRDJCMUYiLz48cGF0aCBkPSJNMjkgMzcuNVEzNSA0MyA0MSAzNy41IiBzdHJva2U9IiM4QjYzNDgiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==" alt="Benjamin Son" />
              <button type="button" class="profile-camera" aria-label="Update profile photo">
                <cs-icon name="photo_camera" [size]="12" aria-hidden="true" />
              </button>
            </div>
            <div>
              <h3 id="profile-user-title">Benjamin, Son</h3>
              <p class="profile-status"><span aria-hidden="true"></span>Online</p>
            </div>
          </div>

          <dl class="profile-data-list">
            @for (item of userInfo; track item.label) {
              <div class="profile-data-row">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            }
          </dl>

          <div class="profile-action-row">
            <cs-icon name="sync" [size]="24" aria-hidden="true" />
            <span>Google Calendar Sync</span>
            <button type="button" class="profile-toggle" [attr.aria-pressed]="googleCalendarSync" (click)="toggleGoogleCalendarSync()">
              <span>{{ googleCalendarSync ? 'ON' : 'OFF' }}</span>
              <i aria-hidden="true"></i>
            </button>
          </div>
        </section>

        <section class="profile-section" aria-labelledby="profile-agency-title">
          <h3 id="profile-agency-title">Agency Details</h3>
          <dl class="profile-data-list">
            @for (item of agencyInfo; track item.label) {
              <div class="profile-data-row">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            }
          </dl>
          <button type="button" class="profile-link-row">
            <cs-icon name="translate" [size]="20" aria-hidden="true" />
            <span>Language</span>
            <strong>English US</strong>
          </button>
        </section>

        <section class="profile-section" aria-labelledby="profile-appearance-title">
          <h3 id="profile-appearance-title">App Appearance</h3>
          <div class="profile-option-group">
            <div class="profile-option-label">
              <cs-icon name="brightness_6" [size]="20" aria-hidden="true" />
              <span>Color Theme</span>
            </div>
            <div class="profile-segmented" role="group" aria-label="Color theme">
              @for (theme of themes; track theme) {
                <button type="button" [class.active]="themeService.theme() === theme" (click)="setTheme(theme)">
                  {{ themeLabels[theme] }}
                </button>
              }
            </div>
          </div>
          <div class="profile-option-group">
            <div class="profile-option-label">
              <cs-icon name="text_fields" [size]="20" aria-hidden="true" />
              <span>Density Mode</span>
            </div>
            <div class="profile-segmented" role="group" aria-label="Density mode">
              @for (density of densities; track density) {
                <button type="button" [class.active]="themeService.density() === density" (click)="setDensity(density)">
                  {{ densityLabels[density] }}
                </button>
              }
            </div>
          </div>
        </section>

        <section class="profile-section" aria-labelledby="profile-security-title">
          <h3 id="profile-security-title">Account & Security</h3>
          <button type="button" class="profile-link-row" (click)="showProfileStatus('ICS Calendar link generated for the next 60 days.')">
            <cs-icon name="event" [size]="20" aria-hidden="true" />
            <span>ICS Calendar for next 60 days</span>
            <cs-icon name="chevron_right" [size]="20" aria-hidden="true" />
          </button>
          <button type="button" class="profile-link-row" (click)="showProfileStatus('Security question update is ready.')">
            <cs-icon name="help" [size]="20" aria-hidden="true" />
            <span>Security Question</span>
            <cs-icon name="chevron_right" [size]="20" aria-hidden="true" />
          </button>
          <button type="button" class="profile-link-row" (click)="showProfileStatus('Password reset link sent to benjamin.s@email.com.')">
            <cs-icon name="lock_reset" [size]="20" aria-hidden="true" />
            <span>Reset</span>
            <cs-icon name="chevron_right" [size]="20" aria-hidden="true" />
          </button>
          <button type="button" class="profile-link-row" (click)="showProfileStatus('Privacy policy opened for review.')">
            <cs-icon name="privacy_tip" [size]="20" aria-hidden="true" />
            <span>Privacy Policy</span>
            <cs-icon name="chevron_right" [size]="20" aria-hidden="true" />
          </button>
          <button type="button" class="profile-link-row profile-link-row--danger" (click)="showProfileStatus('Logout confirmation displayed.')">
            <cs-icon name="logout" [size]="20" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </section>

        <section class="profile-section profile-section--feedback" aria-labelledby="profile-feedback-title">
          <div>
            <h3 id="profile-feedback-title">Share Feedback</h3>
            <p>Tell us about portal experience, issues, or design improvements.</p>
          </div>
          <textarea
            rows="3"
            aria-label="Share Feedback"
            placeholder="Write feedback"
            [value]="feedbackText"
            (input)="updateFeedbackText($event)"
          ></textarea>
          <button type="button" class="profile-primary-action" (click)="submitFeedback()" [disabled]="!feedbackText.trim()">
            Submit Feedback
          </button>
        </section>

        @if (profileStatusMessage) {
          <p class="profile-status-message" aria-live="polite">{{ profileStatusMessage }}</p>
        }
      </div>
    </cs-flyout>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: var(--cs360-space-6);
      height: var(--cs360-topbar-height);
      padding: 0 7px 0 var(--cs360-space-3);
      background-color: var(--cs360-topbar-bg);
      border-bottom: 1px solid var(--cs360-topbar-border);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
    }

    .mobile-menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      background: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      cursor: pointer;
      transition: background-color var(--cs360-transition-fast), border-color var(--cs360-transition-fast);

      &:hover {
        background: var(--cs360-bg-surface-hover);
        border-color: var(--cs360-border-default);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-action-primary);
      }
    }

    /* Breadcrumb — left-aligned, compact; min-width 184px aligns shift card at x=420 per Figma */
    .topbar-breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-1-5);
      flex: 0 0 auto;
      min-width: 184px;
    }

    .breadcrumb-item {
      font-size: var(--cs360-text-sm);
      color: var(--cs360-text-secondary);
      white-space: nowrap;
    }

    .breadcrumb-item--current {
      color: var(--cs360-text-primary);
      font-weight: 500;
    }

    .breadcrumb-sep {
      color: var(--cs360-text-tertiary);
      font-size: var(--cs360-text-sm);
    }

    /* Ongoing shift card — Figma node 3954-168038 */
    /* Whole card is a tappable button: flex row, 32px tall, left-accent border */
    .shift-card {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 32px;
      padding: 0 4px 0 16px;
      background: var(--cs360-shift-card-bg);
      border: none;
      border-left: 6px solid var(--cs360-shift-accent);
      border-radius: 4px;
      flex: 0 0 auto;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;

      &:focus-visible {
        box-shadow: 0 0 0 2px var(--cs360-action-primary);
      }
    }

    /* 24×24 circular avatar */
    .shift-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    /* Name + clock-in on the SAME ROW with 12px gap */
    .shift-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      white-space: nowrap;
      letter-spacing: -0.24px;
    }

    .shift-name {
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
      color: var(--cs360-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .shift-clock {
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: var(--cs360-text-primary);
      white-space: nowrap;
    }

    /* Clock-Out button — success state rectangle (NOT pill) */
    .btn-clock-out {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      min-height: 24px;
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      background: var(--cs360-action-attention);
      color: var(--cs360-action-attention-text);
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background-color var(--cs360-transition-fast);

      &:hover { filter: brightness(0.92); }
    }

    /* Spacer: fills space between pill and right actions */
    .topbar-spacer {
      flex: 1;
    }

    /* Right actions */
    .topbar-right {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-2);
      flex: 0 0 auto;
    }

    .appearance-switchers {
      display: flex;
      align-items: center;
      gap: var(--density-space-2);
      flex: 0 0 auto;
    }

    .appearance-field {
      display: inline-flex;
      align-items: center;
      gap: var(--density-space-1);
      color: var(--cs360-text-secondary);
      font-size: var(--density-text-caption);
      white-space: nowrap;
    }

    .appearance-label {
      font-weight: 500;
      line-height: var(--cs360-line-height-tight);
    }

    .appearance-select {
      min-height: var(--density-control-height-sm);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      background: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      padding: 0 var(--density-space-2);
      font-size: var(--density-text-body-sm);
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--cs360-transition-fast), border-color var(--cs360-transition-fast);

      &:hover {
        background: var(--cs360-bg-surface-hover);
        border-color: var(--cs360-border-default);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-action-primary);
      }
    }

    .btn-adhoc-shift {
      display: inline-flex;
      align-items: center;
      padding: 5px 14px;
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      background: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color var(--cs360-transition-fast);

      &:hover { background: var(--cs360-bg-surface-hover); }
    }

    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: none;
      border-radius: var(--cs360-radius-md);
      color: var(--cs360-text-secondary);
      cursor: pointer;
      transition: all var(--cs360-transition-fast);

      &:hover {
        background-color: var(--cs360-bg-surface-hover);
        color: var(--cs360-text-primary);
      }
    }

    .notification-badge {
      position: absolute;
      top: 3px;
      right: 3px;
      min-width: 16px;
      height: 16px;
      padding: 0 3px;
      background-color: var(--cs360-feedback-error);
      color: var(--cs360-text-inverse);
      font-size: 10px;
      font-weight: 700;
      border-radius: var(--cs360-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: var(--cs360-radius-full);
      overflow: hidden;
      border: 2px solid var(--cs360-border-subtle);
      padding: 0;
      cursor: pointer;
      transition: border-color var(--cs360-transition-fast);

      &:hover { border-color: var(--cs360-action-primary); }

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .profile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: 52px;
      padding: 2px 0;
      background: var(--cs360-bg-surface);
      box-shadow: 0 1px 0 var(--cs360-border-subtle);
    }

    .profile-header h2 {
      flex: 1;
      margin: 0;
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-base);
      font-weight: 500;
      line-height: 1.2;
      text-align: center;
      letter-spacing: -0.24px;
    }

    .profile-icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: var(--cs360-radius-full);
      background: transparent;
      color: var(--cs360-text-primary);
      cursor: pointer;

      &:hover {
        background: var(--cs360-bg-surface-hover);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-action-primary);
      }
    }

    .profile-panel {
      display: flex;
      flex-direction: column;
      gap: 0;
      height: 100%;
      padding: var(--density-space-2) var(--density-space-3);
      overflow-y: auto;
      background: var(--cs360-bg-surface);
    }

    .profile-section {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-bottom: var(--density-space-2);
      border-bottom: 1px solid var(--cs360-border-subtle);

      > h3 {
        margin: 0;
        min-height: 40px;
        padding: var(--density-space-3) 0;
        color: var(--cs360-text-primary);
        font-size: var(--cs360-text-base);
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.24px;
      }
    }

    .profile-section--feedback {
      gap: var(--density-space-3);
      padding-top: var(--density-space-3);
      border-bottom: 0;

      h3 {
        margin: 0;
        color: var(--cs360-text-primary);
        font-size: var(--cs360-text-base);
        font-weight: 500;
      }

      p {
        margin: var(--density-space-1) 0 0;
        color: var(--cs360-text-secondary);
        font-size: var(--cs360-text-sm);
      }

      textarea {
        width: 100%;
        resize: none;
        border: 1px solid var(--cs360-border-subtle);
        border-radius: var(--cs360-radius-md);
        background: var(--cs360-bg-surface);
        color: var(--cs360-text-primary);
        padding: var(--density-space-2) var(--density-space-3);
        font-size: var(--cs360-text-sm);

        &:focus {
          outline: none;
          border-color: var(--cs360-action-primary);
          box-shadow: 0 0 0 2px var(--cs360-action-primary-subtle);
        }
      }
    }

    .profile-identity {
      display: flex;
      align-items: center;
      gap: var(--density-space-5);
      padding: var(--density-space-2) 0;
    }

    .profile-avatar-large {
      position: relative;
      width: 70px;
      height: 70px;
      border-radius: var(--cs360-radius-full);
      flex: 0 0 70px;

      img {
        width: 100%;
        height: 100%;
        border-radius: var(--cs360-radius-full);
        object-fit: cover;
      }
    }

    .profile-camera {
      position: absolute;
      right: 0;
      bottom: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: var(--cs360-radius-full);
      background: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      box-shadow: 0 0 0 1px var(--cs360-border-subtle);
      cursor: pointer;
    }

    .profile-identity h3 {
      margin: 0 0 var(--density-space-2);
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-xl);
      font-weight: 500;
      line-height: 24px;
      letter-spacing: -0.24px;
    }

    .profile-status {
      display: inline-flex;
      align-items: center;
      gap: var(--density-space-1);
      margin: 0;
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);

      span {
        width: 10px;
        height: 10px;
        border-radius: var(--cs360-radius-full);
        background: var(--cs360-feedback-success);
      }
    }

    .profile-data-list {
      display: flex;
      flex-direction: column;
      margin: 0;
    }

    .profile-data-row {
      display: flex;
      align-items: center;
      gap: var(--density-space-3);
      min-height: 24px;
      padding: var(--density-space-3) 0;
      border-bottom: 1px dotted var(--cs360-border-subtle);
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);

      dt {
        flex: 0 0 120px;
        font-weight: 400;
      }

      dd {
        flex: 1;
        margin: 0;
        min-width: 0;
        text-align: right;
      }
    }

    .profile-action-row,
    .profile-link-row {
      display: flex;
      align-items: center;
      gap: var(--density-space-3);
      width: 100%;
      min-height: 44px;
      padding: var(--density-space-3) 0;
      border: 0;
      background: transparent;
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);
      text-align: left;

      > span {
        flex: 1;
      }

      strong {
        color: var(--cs360-action-primary);
        font-weight: 400;
      }
    }

    button.profile-link-row {
      cursor: pointer;

      &:hover {
        color: var(--cs360-action-primary);
      }

      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--cs360-action-primary);
      }
    }

    .profile-link-row--danger {
      color: var(--cs360-feedback-error);
    }

    .profile-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--density-space-2);
      border: 0;
      background: transparent;
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);
      cursor: pointer;

      i {
        position: relative;
        width: 40px;
        height: 20px;
        border-radius: var(--cs360-radius-full);
        background: var(--cs360-action-primary);

        &::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: var(--cs360-radius-full);
          background: var(--cs360-bg-surface);
          transition: transform var(--cs360-transition-fast);
        }
      }

      &[aria-pressed='false'] i {
        background: var(--cs360-bg-muted);

        &::after {
          transform: translateX(-20px);
        }
      }
    }

    .profile-option-group {
      display: flex;
      flex-direction: column;
      gap: var(--density-space-1);
      padding: var(--density-space-3) 0;
    }

    .profile-option-label {
      display: flex;
      align-items: center;
      gap: var(--density-space-3);
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);
    }

    .profile-segmented {
      display: inline-flex;
      align-self: flex-start;
      gap: var(--density-space-1);
      padding: var(--density-space-1);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-lg);
      background: var(--cs360-bg-muted);

      button {
        border: 0;
        border-radius: var(--cs360-radius-md);
        background: transparent;
        color: var(--cs360-text-secondary);
        cursor: pointer;
        padding: var(--density-space-1) var(--density-space-3);
        font-size: var(--cs360-text-sm);

        &.active {
          background: var(--cs360-bg-surface);
          color: var(--cs360-text-primary);
          box-shadow: var(--cs360-shadow-sm);
        }

        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--cs360-action-primary);
        }
      }
    }

    .profile-primary-action {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--cs360-radius-md);
      background: var(--cs360-action-primary);
      color: var(--cs360-action-primary-text);
      cursor: pointer;
      padding: var(--density-space-2) var(--density-space-4);
      font-size: var(--cs360-text-sm);
      font-weight: 500;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-action-primary-subtle);
      }
    }

    .profile-status-message {
      margin: 0;
      padding: var(--density-space-3);
      border-radius: var(--cs360-radius-md);
      background: var(--cs360-feedback-success-bg);
      color: var(--cs360-feedback-success);
      font-size: var(--cs360-text-sm);
    }

    /* Tablet landscape and below (≤1024px): compact topbar, hamburger, drawer sidebar */
    @media (max-width: 1024px) {
      .topbar {
        gap: var(--cs360-space-2);
        padding: 0 var(--cs360-space-3);
      }

      .mobile-menu-btn {
        display: inline-flex;
      }

      .topbar-breadcrumb {
        display: none;
      }

      .shift-card {
        flex: 1 1 auto;
        width: auto;
        min-width: 0;
      }

      .shift-info {
        min-width: 0;
        overflow: hidden;
      }

      /* On tablet landscape: hide name, keep avatar + clock-in + clock-out */
      .shift-name {
        display: none;
      }

      .btn-clock-out,
      .appearance-switchers,
      .btn-adhoc-shift {
        display: none;
      }

      .topbar-right {
        gap: var(--cs360-space-1);
      }
    }

    /* Small phones (≤480px): further compact */
    @media (max-width: 480px) {
      .topbar {
        gap: var(--cs360-space-1);
        padding: 0 var(--cs360-space-2);
      }

      .shift-clock {
        font-size: 12px;
      }
    }
  `]
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDensity = new EventEmitter<void>();

  themeService = inject(ThemeService);

  themes: Theme[] = ['light', 'soothing-dark', 'high-contrast'];
  densities: Density[] = ['compact', 'default', 'comfortable'];
  readonly themeLabels: Record<Theme, string> = {
    light: 'Light',
    'soothing-dark': 'Soothing dark',
    'high-contrast': 'High contrast',
  };
  readonly densityLabels: Record<Density, string> = {
    compact: 'Compact',
    default: 'Normal',
    comfortable: 'Comfortable',
  };
  readonly userInfo = [
    { label: 'Phone', value: '(123) 456-0987 extn. 1234' },
    { label: 'Email', value: 'benjamin.s@email.com' },
    { label: 'Employee ID', value: '12389ADH' },
    { label: 'Time Tracking ID', value: '200801234125' },
  ];
  readonly agencyInfo = [
    { label: 'Agency ID', value: '001' },
    { label: 'Office', value: 'Caresmartz360 Office' },
    { label: 'Phone', value: '(999) 123-0987' },
    { label: 'Time Tracking Number', value: '(001) 123-0987' },
  ];

  isProfileOpen = false;
  googleCalendarSync = true;
  feedbackText = '';
  profileStatusMessage = '';

  openProfile(): void {
    this.isProfileOpen = true;
    this.profileStatusMessage = '';
  }

  closeProfile(): void {
    this.isProfileOpen = false;
  }

  toggleGoogleCalendarSync(): void {
    this.googleCalendarSync = !this.googleCalendarSync;
    this.showProfileStatus(`Google Calendar Sync ${this.googleCalendarSync ? 'enabled' : 'disabled'}.`);
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.showProfileStatus(`${this.themeLabels[theme]} theme applied.`);
  }

  setDensity(density: Density): void {
    this.themeService.setDensity(density);
    this.showProfileStatus(`${this.densityLabels[density]} density applied.`);
  }

  setThemeFromEvent(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || !this.isTheme(target.value)) {
      this.showProfileStatus('Unable to apply theme. Please choose a valid theme.');
      return;
    }

    this.setTheme(target.value);
  }

  setDensityFromEvent(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || !this.isDensity(target.value)) {
      this.showProfileStatus('Unable to apply density. Please choose a valid density mode.');
      return;
    }

    this.setDensity(target.value);
  }

  updateFeedbackText(event: Event): void {
    if (!(event.target instanceof HTMLTextAreaElement)) {
      return;
    }

    this.feedbackText = event.target.value;
  }

  submitFeedback(): void {
    const feedback = this.feedbackText.trim();
    if (!feedback) {
      this.showProfileStatus('Enter feedback before submitting.');
      return;
    }

    this.feedbackText = '';
    this.showProfileStatus('Feedback submitted.');
  }

  showProfileStatus(message: string): void {
    this.profileStatusMessage = message;
  }

  private isTheme(value: string): value is Theme {
    return this.themes.includes(value as Theme);
  }

  private isDensity(value: string): value is Density {
    return this.densities.includes(value as Density);
  }
}
