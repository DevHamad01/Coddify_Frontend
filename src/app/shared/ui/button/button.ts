import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Spinner } from '../spinner/spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-btn ' +
  'font-display font-bold tracking-wide transition-[transform,box-shadow,background-color,filter,border-color] duration-hover ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50';

/** Chunky buttons get a 4px darker "lip" that collapses on press. */
const PRESS = 'shadow-press active:translate-y-1 active:shadow-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: `${PRESS} bg-primary text-primary-contrast [--press-color:rgb(var(--c-primary-press))] hover:brightness-110`,
  secondary: `${PRESS} border-2 border-border bg-surface text-text [--press-color:rgb(var(--c-border))] hover:bg-surface-2`,
  ghost: 'bg-transparent text-text hover:bg-surface-2 active:bg-surface-2',
  danger: `${PRESS} bg-danger text-white [--press-color:color-mix(in_srgb,rgb(var(--c-danger))_70%,black)] hover:brightness-110`,
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
};

/**
 * Use on native elements so links keep router behaviour and buttons keep form semantics:
 * `<button appButton variant="primary">` or `<a appButton routerLink="/register">`.
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Spinner],
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
  template: `
    @if (loading()) {
      <app-spinner [size]="18" [label]="loadingLabel()" />
    }
    <ng-content />
  `,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loadingLabel = input<string>('Please wait');

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());
  protected readonly classes = computed(() =>
    [BASE, VARIANTS[this.variant()], SIZES[this.size()], this.block() ? 'w-full' : ''].join(' '),
  );
}
