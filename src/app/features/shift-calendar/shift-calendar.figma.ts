import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { view: figma.enum('View', { Week: 'week', Month: 'month', Day: 'day' }) }, example: (props) => html`<app-shift-calendar view="${props.view}"></app-shift-calendar>` });
