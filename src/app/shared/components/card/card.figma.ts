import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { elevated: figma.boolean('Elevated'), padding: figma.enum('Padding', { None: 'none', Small: 'sm', Medium: 'md', Large: 'lg' }) }, example: (props) => html`<app-card [elevated]="${props.elevated}" padding="${props.padding}"></app-card>` });
