import figma, { html } from '@figma/code-connect';
figma.connect('https://www.figma.com/design/XCvAxa7G7QgiTfk08G2LGg', { props: { clientName: figma.string('Client Name'), status: figma.enum('Status', { Active: 'active', Inactive: 'inactive', OnHold: 'on-hold' }) }, example: (props) => html`<app-client-card clientName="${props.clientName}" status="${props.status}"></app-client-card>` });
