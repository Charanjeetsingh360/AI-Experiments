import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { status: figma.enum('Status', { ClockedIn: 'clocked-in', ClockedOut: 'clocked-out' }) }, example: (props) => html`<app-topbar status="${props.status}"></app-topbar>` });
