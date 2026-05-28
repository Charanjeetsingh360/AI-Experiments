import figma, { html } from '@figma/code-connect';

figma.connect(
  'https://www.figma.com/design/TSOq0ugv6zfr6gFZh5zYrP/Caregiver-App?node-id=2767-61480',
  {
    props: {
      label: figma.string('Label'),
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Ghost: 'ghost',
        Danger: 'danger',
      }),
      size: figma.enum('Size', {
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      }),
      disabled: figma.boolean('Disabled'),
    },
    example: (props) =>
      html`<app-button
        variant="${props.variant}"
        size="${props.size}"
        [disabled]="${props.disabled}"
      >
        ${props.label}
      </app-button>`,
  }
);
