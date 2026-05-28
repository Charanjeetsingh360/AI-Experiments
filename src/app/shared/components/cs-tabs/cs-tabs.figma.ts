import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { variant: figma.enum('Variant', { Default: 'default', Pills: 'pills', Underline: 'underline' }) }, example: (props) => html`<app-cs-tabs variant="${props.variant}"></app-cs-tabs>` });
