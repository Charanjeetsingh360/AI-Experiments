import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';

type AuthMode = 'login' | 'reset' | 'change';
type ResetStep = 'username' | 'method' | 'otp' | 'password' | 'complete';

interface PasswordState {
  isStrong: boolean;
  matches: boolean;
}

@Component({
  selector: 'cs-auth',
  standalone: true,
  imports: [CommonModule, RouterLink, CSIconComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-theme]': 'themeService.theme()',
    '[attr.data-density]': 'themeService.density()',
  },
})
export class AuthComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  readonly mode = signal<AuthMode>(this.route.snapshot.data['mode'] ?? 'login');
  readonly resetStep = signal<ResetStep>('username');
  readonly resetMethod = signal<'otp' | 'security'>('otp');
  readonly otpAttemptsRemaining = signal(3);
  readonly statusMessage = signal('');
  readonly alertMessage = signal('');

  readonly username = signal('');
  readonly password = signal('');
  readonly resetUsername = signal('');
  readonly resetOtp = signal('');
  readonly securityAnswer = signal('');
  readonly registrationOtp = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly securityQuestion = signal('What is your favorite care recipient memory?');
  readonly registrationSecurityAnswer = signal('');

  readonly pageTitle = computed(() => {
    if (this.mode() === 'change') return 'New User';
    if (this.mode() === 'reset') return this.resetStep() === 'password' ? 'Reset Password' : 'Onetime Password';
    return 'Login to your Account';
  });

  readonly pageSubtitle = computed(() => {
    if (this.mode() === 'change') return 'Fill Information to activate your account.';
    if (this.mode() === 'reset') {
      if (this.resetStep() === 'username') return 'Enter your username to reset your password.';
      if (this.resetStep() === 'password') return 'Dear Benjamin, Please enter a new password. You want to link to your account.';
      return 'We will validate your OTP or security answer before password reset.';
    }
    return 'Please enter your Username, and Password.';
  });

  readonly passwordState = computed<PasswordState>(() => {
    const nextPassword = this.newPassword();
    return {
      isStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(nextPassword),
      matches: nextPassword.length > 0 && nextPassword === this.confirmPassword(),
    };
  });

  updateField(field: 'username' | 'password' | 'resetUsername' | 'resetOtp' | 'securityAnswer' | 'registrationOtp' | 'newPassword' | 'confirmPassword' | 'registrationSecurityAnswer', event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      this.alertMessage.set('Unable to read field value. Please try again.');
      return;
    }

    const value = target.value;
    const fields = {
      username: this.username,
      password: this.password,
      resetUsername: this.resetUsername,
      resetOtp: this.resetOtp,
      securityAnswer: this.securityAnswer,
      registrationOtp: this.registrationOtp,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
      registrationSecurityAnswer: this.registrationSecurityAnswer,
    };

    fields[field].set(value);
  }

  updateSecurityQuestion(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      this.alertMessage.set('Unable to read security question. Please try again.');
      return;
    }

    this.securityQuestion.set(target.value);
  }

  login(): void {
    this.clearMessages();
    if (!this.username().trim() || !this.password().trim()) {
      this.alertMessage.set('Username and password are mandatory.');
      return;
    }

    void this.router.navigateByUrl('/home');
  }

  startReset(): void {
    this.clearMessages();
    if (!this.resetUsername().trim()) {
      this.alertMessage.set('Username is mandatory.');
      return;
    }

    this.resetStep.set('method');
    this.statusMessage.set('Reset options loaded for benjamin.s@email.com.');
  }

  chooseResetMethod(method: 'otp' | 'security'): void {
    this.clearMessages();
    this.resetMethod.set(method);
  }

  requestOtp(): void {
    this.clearMessages();
    if (this.otpAttemptsRemaining() <= 0) {
      this.alertMessage.set('OTP resend attempts are exhausted.');
      return;
    }

    this.otpAttemptsRemaining.update((attempts) => attempts - 1);
    this.resetStep.set('otp');
    this.statusMessage.set(`OTP sent to benjamin.s@email.com. Attempts remaining ${this.otpAttemptsRemaining()}.`);
  }

  validateOtp(): void {
    this.clearMessages();
    if (this.resetOtp() !== '123456') {
      this.alertMessage.set('Entered OTP is incorrect. Please check your registered email inbox and try again with correct OTP.');
      return;
    }

    this.resetStep.set('password');
  }

  validateSecurityAnswer(): void {
    this.clearMessages();
    if (!this.securityAnswer().trim()) {
      this.alertMessage.set('Security answer is mandatory.');
      return;
    }

    this.resetStep.set('password');
  }

  submitPasswordReset(): void {
    this.clearMessages();
    if (!this.passwordState().isStrong) {
      this.alertMessage.set('Password criteria not fulfilled. Use 8 characters with uppercase, lowercase, and number.');
      return;
    }
    if (!this.passwordState().matches) {
      this.alertMessage.set('New Password and Confirm Password should match.');
      return;
    }

    this.resetStep.set('complete');
    this.statusMessage.set('Password reset successful. Navigating you to the login page.');
  }

  submitRegistration(): void {
    this.clearMessages();
    if (!this.registrationOtp().trim() || !this.newPassword().trim() || !this.confirmPassword().trim() || !this.securityQuestion().trim() || !this.registrationSecurityAnswer().trim()) {
      this.alertMessage.set('OTP, password, security question, and security answer are mandatory.');
      return;
    }
    if (this.registrationOtp() !== '123456') {
      this.alertMessage.set('OTP should match the temporary password received over registration email.');
      return;
    }
    if (!this.passwordState().isStrong || !this.passwordState().matches) {
      this.alertMessage.set('Password should meet criteria and both password fields should match.');
      return;
    }

    this.statusMessage.set('Account registered successfully. Navigating you to the login page.');
  }

  resetToLogin(): void {
    void this.router.navigateByUrl('/login');
  }

  private clearMessages(): void {
    this.statusMessage.set('');
    this.alertMessage.set('');
  }
}
