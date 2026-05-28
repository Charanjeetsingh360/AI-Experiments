import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { name: figma.string('Name'), size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }) }, example: (props) => html`<app-cs-icon name="${props.name}" size="${props.size}"></app-cs-icon>` });
