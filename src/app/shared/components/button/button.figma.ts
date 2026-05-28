import figma, { html } from '@figma/code-connect';

figma.connect(
  'https://www.figma.com/design/TSOq0ugv6zfr6gFZh5zYrP/Caregiver-App?node-id=2767-61480',
  {
    example: () =>
      html`<app-button variant="primary" size="md" [disabled]="false">
        Label
      </app-button>`
  }
);
