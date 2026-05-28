import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { collapsed: figma.boolean('Collapsed') }, example: (props) => html`<app-sidebar [collapsed]="${props.collapsed}"></app-sidebar>` });
