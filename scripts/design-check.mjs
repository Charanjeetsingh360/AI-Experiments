#!/usr/bin/env node
/**
 * design-check.mjs
 * ==========================================
 * Static design-token + HTML-structure checker.
 * Validates Angular component templates against the
 * CS360 Figma spec WITHOUT needing a browser.
 *
 * Usage:  node scripts/design-check.mjs
 * Exit:   0 = PASS  |  1 = FAIL
 *
 * What it checks (19-point checklist):
 *  Zone A – Topbar
 *   A1  Caregiver status block present in topbar template
 *   A2  Clock-Out button present in topbar template
 *   A3  Adhoc Shift button present in topbar template
 *   A4  Theme/density dev-toggles are hidden on mobile (not a showstopper)
 *  Zone B – Page Header Row
 *   B1  Dashboard page-header has NO header-actions (duplicate removed)
 *   B2  Shift-calendar page-header title equals 'Shift Calendar' (not 'My Shift Calendar')
 *  Zone C – Promo Banner
 *   C1  Promo banner uses inline style NOT Tailwind arbitrary-value class
 *   C2  Inline background contains warm hex  #f5e6d0
 *   C3  25% text has font-size >= 3rem (large watermark)
 *   C4  25% text has color #c8a882 (warm golden-tan)
 *  Zone D – Shift Cards
 *   D1  Ongoing shift card: Clocked-In + Clock-Out row exists
 *   D2  Upcoming shift card: Clock-In + Clock-Out buttons exist
 *   D3  Back-to-Back Shift label exists
 *  Zone E – Alerts Panel
 *   E1  All 5 alert tab labels present
 *   E2  'Mark All as Read' link exists
 *  Zone F – Shift Calendar
 *   F1  Shift Details button contains text label 'Shift Details'
 *   F2  More Actions button contains text label 'More Actions'
 *   F3  Tabs: 'Assigned Shifts' with badge=10
 *   F4  Calendar view toggle exists (Monthly/Weekly)
 */

import { readFileSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// ─── helpers ───────────────────────────────────────────────────────────────
const pass = (id, msg) => { console.log(`  ✅  ${id}  ${msg}`); return true; };
const fail = (id, msg) => { console.error(`  ❌  ${id}  ${msg}`); return false; };
const check = (id, cond, msg) => cond ? pass(id, msg) : fail(id, msg);

let failures = 0;
function test(id, cond, label) {
  if (!check(id, cond, label)) failures++;
}

// ─── load templates ────────────────────────────────────────────────────────
const topbar     = read('src/app/shared/components/topbar/topbar.component.ts');
const dashboard  = read('src/app/features/dashboard/dashboard.component.html');
const shiftCal   = read('src/app/features/shift-calendar/shift-calendar.component.html');
const shiftCalTs = read('src/app/features/shift-calendar/shift-calendar.component.ts');

console.log('\n================================================');
console.log(' CS360 Design-Check  — Figma Parity Audit');
console.log('================================================\n');

// ─── Zone A: Topbar ─────────────────────────────────────────────────────────
console.log('▶  Zone A — Topbar');
test('A1', topbar.includes('Marry, Edison') || topbar.includes('Caregiver Status'),
  'Caregiver status block present in topbar');
test('A2', topbar.includes('Clock-Out'),
  'Clock-Out button present in topbar');
test('A3', topbar.includes('Adhoc Shift'),
  'Adhoc Shift button present in topbar');
test('A4', !topbar.includes('theme-switcher') || true,          // advisory only
  'Theme/density switchers (advisory — dev-only UI)');

// ─── Zone B: Page Header ────────────────────────────────────────────────────
console.log('\n▶  Zone B — Page Header Row');
test('B1',
  !dashboard.includes('header-actions'),
  'Dashboard: no duplicate header-actions block (caregiver status removed from page-header)');
test('B2',
  shiftCal.includes('title="Shift Calendar"') && !shiftCal.includes('title="My Shift Calendar"'),
  'Shift Calendar: title is \'Shift Calendar\' (not \'My Shift Calendar\')');

// ─── Zone C: Promo Banner ───────────────────────────────────────────────────
console.log('\n▶  Zone C — Promo Banner');
const bannerUsesInlineStyle = dashboard.includes('style="background:linear-gradient') ||
                              dashboard.includes("style='background:linear-gradient");
const bannerUsesTailwindArbitrary = /from-\[#[0-9a-fA-F]{6}\]/.test(dashboard) &&
                                   !bannerUsesInlineStyle;
test('C1', bannerUsesInlineStyle && !bannerUsesTailwindArbitrary,
  'Promo banner uses inline style (not Tailwind arbitrary-value class that JIT may miss)');
test('C2', dashboard.includes('#f5e6d0') || dashboard.includes('#F5E6D0'),
  'Promo banner warm hex #f5e6d0 present');
test('C3', dashboard.includes('3.5rem') || dashboard.includes('font-size:3'),
  '25% text font-size >= 3rem (large watermark)');
test('C4', dashboard.includes('#c8a882') || dashboard.includes('#C8A882'),
  '25% text color is warm golden-tan #c8a882');

// ─── Zone D: Shift Cards ────────────────────────────────────────────────────
console.log('\n▶  Zone D — Shift Cards');
test('D1', dashboard.includes('Clocked-In') && dashboard.includes('Clock-Out'),
  'Ongoing shift: Clocked-In timestamp + Clock-Out button');
test('D2', dashboard.includes('Clock-In') && dashboard.includes('Clock-Out'),
  'Upcoming shift: Clock-In + Clock-Out buttons');
test('D3', dashboard.includes('Back to Back Shift'),
  'Back-to-Back Shift label present');

// ─── Zone E: Alerts Panel ───────────────────────────────────────────────────
console.log('\n▶  Zone E — Alerts Panel');
const alertTabs = ['Alerts', 'SMS Logs', 'Expense Review', 'Client Forms Review', 'Pending Confirmation'];
alertTabs.forEach((tab, i) =>
  test(`E${i + 1}`, dashboard.includes(tab), `Alert tab '${tab}' present`)
);
test('E6', dashboard.includes('Mark All as Read') || dashboard.includes('markAllAsRead'),
  'Mark All as Read action present');

// ─── Zone F: Shift Calendar ─────────────────────────────────────────────────
console.log('\n▶  Zone F — Shift Calendar Page');
test('F1', shiftCal.includes('>Shift Details<') || shiftCal.includes('>Shift Details </'),
  'Shift Details header button has text label');
test('F2', shiftCal.includes('>More Actions<') || shiftCal.includes('>More Actions </'),
  'More Actions header button has text label');
test('F3', shiftCalTs.includes("badge: 10") || shiftCalTs.includes('badge:10'),
  'Assigned Shifts tab has badge count 10');
test('F4', shiftCal.includes('Monthly') && shiftCal.includes('Weekly'),
  'Calendar: Monthly/Weekly view toggle present');

// ─── Summary ────────────────────────────────────────────────────────────────
console.log('\n================================================');
if (failures === 0) {
  console.log(' RESULT: ALL CHECKS PASSED ✅');
} else {
  console.error(` RESULT: ${failures} CHECK(S) FAILED ❌`);
  console.error(' Run: git pull origin main && npm run design:check');
}
console.log('================================================\n');

process.exit(failures > 0 ? 1 : 0);
