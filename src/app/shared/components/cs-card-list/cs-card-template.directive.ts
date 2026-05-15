import { Directive, TemplateRef } from '@angular/core';

/**
 * Structural directive for cs-card-list card body template.
 * Usage: <ng-template csCardTemplate let-item> ... </ng-template>
 */
@Directive({
  selector: '[csCardTemplate]',
  standalone: true,
})
export class CsCardTemplateDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
