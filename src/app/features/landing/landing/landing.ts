import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Accordion } from '../../../shared/ui/accordion/accordion';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';
import { Checkbox } from '../../../shared/ui/checkbox/checkbox';
import { Chip } from '../../../shared/ui/chip/chip';
import { Input } from '../../../shared/ui/input/input';
import { Mascot } from '../../../shared/ui/mascot/mascot';
import { ProgressBar } from '../../../shared/ui/progress-bar/progress-bar';
import { Stepper } from '../../../shared/ui/stepper/stepper';
import { ToastService } from '../../../shared/ui/toast/toast.service';

/** Temporary Phase A showcase; replaced by the real landing page in Phase B. */
@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Accordion, Button, Card, Checkbox, Chip, Input, Mascot, ProgressBar, Stepper],
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly toast = inject(ToastService);
  protected readonly loading = signal(false);
  protected readonly email = new FormControl('', { nonNullable: true });
  protected readonly password = new FormControl('', { nonNullable: true });
  protected readonly terms = new FormControl(false, { nonNullable: true });
}
