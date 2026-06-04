import { expect, test } from '@playwright/test';

test.describe('feature prototype flows', () => {
  test('auth supports login validation and successful navigation', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /^Login$/ }).click();
    await expect(page.getByRole('alert')).toContainText('Username and password are mandatory');

    await page.getByLabel('Username').fill('elisa.william1990');
    await page.getByLabel('Password').fill('iLikeCareSmartz360');
    await page.getByRole('button', { name: /^Login$/ }).click();
    await expect(page).toHaveURL(/\/home$/);
  });

  test('auth supports reset password OTP and password criteria flow', async ({ page }) => {
    await page.goto('/reset-password', { waitUntil: 'networkidle' });

    await page.getByLabel('Username').fill('elisa.william1990');
    await page.getByRole('button', { name: /^Submit$/ }).click();
    await page.getByRole('button', { name: /^Get OTP$/ }).click();
    await expect(page.getByRole('button', { name: /Resend OTP \(Attempts remaining 2\)/i })).toBeVisible();

    await page.getByLabel('OTP').fill('000000');
    await page.getByRole('button', { name: /^Verify$/ }).click();
    await expect(page.getByRole('alert')).toContainText('Entered OTP is incorrect');

    await page.getByLabel('OTP').fill('123456');
    await page.getByRole('button', { name: /^Verify$/ }).click();
    await page.getByRole('textbox', { name: 'New Password', exact: true }).fill('CareSmartz1');
    await page.getByLabel('Confirm New Password').fill('CareSmartz1');
    await page.getByRole('button', { name: /^Submit$/ }).click();
    await expect(page.getByText('Password reset successful')).toBeVisible();
  });

  test('auth supports first-time change password registration', async ({ page }) => {
    await page.goto('/change-password', { waitUntil: 'networkidle' });

    await page.getByLabel('OTP').fill('123456');
    await page.getByRole('textbox', { name: 'New Password', exact: true }).fill('CareSmartz1');
    await page.getByLabel('Confirm New Password').fill('CareSmartz1');
    await page.getByLabel('Security Question').selectOption('What city were you born in?');
    await page.getByLabel('Security Answer').fill('Austin');
    await page.getByRole('button', { name: /^Submit$/ }).click();

    await expect(page.getByText('Account registered successfully')).toBeVisible();
  });

  test('home dashboard supports adhoc shifts and alert drill-in', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /create adhoc shift/i }).click();
    await page.getByLabel(/client name/i).fill('Marry, Edison');
    await page.getByRole('button', { name: /^Create$/ }).click();
    await expect(page.getByRole('status')).toContainText('Adhoc shift created');

    await page.getByText('Missed Clock-Out').first().click();
    await expect(page.getByRole('heading', { name: 'Notification Details' })).toBeVisible();
  });

  test('topbar profile supports profile details, appearance settings and feedback', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /open profile/i }).click();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText('Benjamin, Son')).toBeVisible();
    await expect(page.getByText('Google Calendar Sync')).toBeVisible();

    await page.getByRole('button', { name: /^Dark$/ }).click();
    await expect(page.getByText('Dark theme applied.')).toBeVisible();
    await page.getByRole('button', { name: /^Light$/ }).click();

    await page.getByRole('textbox', { name: 'Share Feedback' }).fill('Profile panel matches Jira profile flow.');
    await page.getByRole('button', { name: /^Submit Feedback$/ }).click();
    await expect(page.getByText('Feedback submitted.')).toBeVisible();
  });

  test('shift calendar supports tab switching, open-shift navigation and applying', async ({ page }) => {
    await page.goto('/shift-calendar', { waitUntil: 'networkidle' });

    const adhocTab = page.getByRole('tab', { name: /Adhoc/i });
    await adhocTab.click();
    await expect(adhocTab).toHaveAttribute('aria-selected', 'true');

    const meetingsTab = page.getByRole('tab', { name: /Meetings/i });
    await meetingsTab.click();
    await expect(meetingsTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('External Meeting')).toBeVisible();

    await page.getByRole('button', { name: /details for external meeting/i }).click();
    await expect(page.getByRole('heading', { name: 'Meeting Details' })).toBeVisible();
    await expect(page.getByText('Primary Information')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await page.getByRole('button', { name: /close meeting details/i }).click();

    await page.getByRole('button', { name: /add expense for external meeting/i }).click();
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByText('Expense code is required.')).toBeVisible();
    await page.getByLabel(/expense code/i).selectOption('Mileage');
    await page.getByLabel(/rate/i).fill('12');
    await page.getByLabel(/unit/i).fill('3');
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByRole('status')).toContainText('Mileage expense saved');

    await adhocTab.click();
    await page.getByRole('button', { name: /more actions/i }).click();
    await page.getByRole('menuitem', { name: /view open shifts/i }).click();
    await expect(page.getByRole('status')).toContainText('Open shifts are visible');

    await page.getByText('Eleanor, Vasquez').click();
    await page.getByRole('button', { name: /^Apply$/ }).click();
    await expect(page.getByRole('status')).toContainText('Applied to Eleanor');
  });

  test('shift details enforces mandatory clock-out actions', async ({ page }) => {
    await page.goto('/shift-calendar', { waitUntil: 'networkidle' });

    await page.getByRole('tab', { name: /Assigned Shifts/i }).click();
    await page.locator('cs-shift-card').filter({ hasText: 'Clock-In 2:03 PM' }).click();
    await expect(page.getByRole('heading', { name: 'Shift Details' })).toBeVisible();

    await page.getByRole('button', { name: /^Clock-Out$/ }).click();
    await expect(page.getByRole('alert')).toContainText('mandatory for clock-out');

    const taskPanel = page.locator('.sc-shift-panel');
    const taskStatuses = taskPanel.locator('select');
    for (let index = 0; index < await taskStatuses.count(); index += 1) {
      await taskStatuses.nth(index).selectOption('Completed');
    }
    await page.getByRole('button', { name: /save tasks/i }).click();

    await expect(page.getByRole('heading', { name: 'Signatures' })).toBeVisible();
    const signaturePanel = page.locator('.sc-signature-grid');
    await signaturePanel.getByRole('button', { name: /caregiver signature/i }).click();
    await signaturePanel.getByRole('button', { name: /client signature/i }).click();
    await page.getByRole('button', { name: /save signatures/i }).click();

    await expect(page.getByRole('heading', { name: /injury \/ incident/i })).toBeVisible();
    await page.getByRole('button', { name: /no injury/i }).click();
    await page.getByRole('button', { name: /^Clock-Out$/ }).click();
    await expect(page.getByRole('status')).toContainText('Clocked out from Marry, Edison');
  });

  test('clients supports detail flyout and assessment creation', async ({ page }) => {
    await page.goto('/clients', { waitUntil: 'networkidle' });

    await page.getByRole('listitem', { name: 'Marry, Edison' }).first().click();
    await page.getByRole('button', { name: /create assessment/i }).click();
    await page.getByLabel(/assessment name/i).fill('Start of care assessment');
    await page.getByLabel(/assessment type/i).selectOption('Start of Care');
    await page.getByRole('button', { name: /^Create$/ }).click();

    await expect(page.getByRole('status')).toContainText('created for Marry, Edison');
  });

  test('availability supports shift detail, calendar day and apply flow', async ({ page }) => {
    await page.goto('/availability', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /shift details/i }).click();
    await expect(page.getByRole('heading', { name: 'Shift Details' })).toBeVisible();
    await page.getByRole('button', { name: /^Apply$/ }).click();
    await expect(page.getByRole('status')).toContainText('Applied to');

    await page.getByRole('button', { name: /close shift details/i }).click();
    await page.getByRole('button', { name: /^27$/ }).click();
    await expect(page.getByRole('status')).toContainText('Calendar day 27 selected');

    await page.getByRole('button', { name: /more actions/i }).click();
    await page.getByRole('menuitem', { name: /add availability \/ unavailability/i }).click();
    await page.getByRole('button', { name: /^Add Unavailability/i }).click();
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByRole('status')).toContainText('Reason is mandatory');

    await page.getByLabel(/reason/i).selectOption('Vacation');
    await page.getByLabel(/start date/i).fill('2025-12-15');
    await page.getByLabel(/all day/i).check();
    await page.getByRole('combobox', { name: /^Recurrence$/ }).selectOption('Weekly');
    await page.getByLabel('Wed').check();
    await page.getByLabel('Fri').check();
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByRole('status')).toContainText('Added unavailability saved');
  });

  test('documents supports validation, upload, save and download feedback', async ({ page }) => {
    await page.goto('/documents', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /add new/i }).click();
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByText('File name is required.')).toBeVisible();

    await page.getByPlaceholder('Enter file name').fill('Updated Credential');
    await page.getByRole('button', { name: /click to upload/i }).click();
    await page.getByRole('button', { name: /^Save$/ }).click();
    await expect(page.getByRole('status')).toContainText('Updated Credential saved');

    await page.getByRole('button', { name: /Updated Credential DOCUMENT/i }).click();
    await page.getByRole('button', { name: /^Download$/ }).click();
    await expect(page.getByRole('status')).toContainText('download prepared');
  });

  test('messages supports agency compose, attachment and send flow', async ({ page }) => {
    await page.goto('/messages', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /send a message to agency/i }).click();
    await expect(page.getByRole('status')).toContainText('Agency support conversation opened');

    await page.getByRole('button', { name: /add attachment/i }).click();
    await page.getByLabel(/write your message/i).fill('Please review my schedule.');
    await page.getByRole('button', { name: /^Send message$/ }).click();
    await expect(page.getByRole('status')).toContainText('Message sent');

    await page.getByRole('button', { name: /add participant/i }).click();
    await expect(page.getByRole('status')).toContainText('Participant added');
  });

  test('caregiver forms supports create and submit flow', async ({ page }) => {
    await page.goto('/caregiver-forms', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /add new form/i }).click();
    await page.getByPlaceholder('Enter form name').fill('Evening Visit Note');
    await page.getByRole('button', { name: /create form/i }).click();
    await expect(page.getByText('Evening Visit Note')).toBeVisible();

    await page.getByRole('button', { name: /open form/i }).first().click();
    await page.getByRole('button', { name: /submit for approval/i }).click();
    await expect(page.locator('.caregiver-forms__review-summary .caregiver-forms__status')).toContainText('AWAITING APPROVAL');
  });

  test('trainings supports training completion and report export', async ({ page }) => {
    await page.goto('/trainings', { waitUntil: 'networkidle' });

    await page.getByText('Professional Caregiver Training Course').click();
    await page.getByRole('button', { name: /resume training/i }).click();
    await expect(page.getByRole('status')).toContainText('completed');

    await page.getByRole('button', { name: /^Close$/ }).click();
    await page.getByRole('tab', { name: /training report/i }).click();
    await page.getByRole('button', { name: /Basic Life Support \(BLS\)/i }).click();
    await page.getByRole('button', { name: /export report/i }).click();
    await expect(page.getByRole('status')).toContainText('report export prepared');
  });
});
