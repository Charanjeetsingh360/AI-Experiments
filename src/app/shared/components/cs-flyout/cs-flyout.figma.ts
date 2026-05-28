import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { title: figma.string('Title'), size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg', Full: 'full' }) }, example: (props) => html`<app-cs-flyout title="${props.title}" size="${props.size}"></app-cs-flyout>` });
