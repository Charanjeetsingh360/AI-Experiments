import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { type: figma.enum('Type', { Text: 'text', Circle: 'circle', Rectangle: 'rectangle', Card: 'card' }) }, example: (props) => html`<app-cs-skeleton type="${props.type}"></app-cs-skeleton>` });
