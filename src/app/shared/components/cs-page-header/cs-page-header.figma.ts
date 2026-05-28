import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { title: figma.string('Title'), showBack: figma.boolean('Show Back') }, example: (props) => html`<app-cs-page-header title="${props.title}" [showBack]="${props.showBack}"></app-cs-page-header>` });
