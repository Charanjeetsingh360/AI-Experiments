import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { loading: figma.boolean('Loading') }, example: (props) => html`<app-cs-card-list [loading]="${props.loading}"></app-cs-card-list>` });
