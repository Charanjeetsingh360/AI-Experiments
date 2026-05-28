import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { day: figma.string('Day'), available: figma.boolean('Available') }, example: (props) => html`<app-cs-availability-card day="${props.day}" [available]="${props.available}"></app-cs-availability-card>` });
