import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { toApiError } from '../../../core/api/api-error';
import { GamificationApi } from '../../../core/gamification/gamification-api';
import { SocialNetwork } from '../../../core/gamification/gamification.models';
import { LevelCard } from '../../../layouts/app-layout/rail/level-card/level-card';
import { PageShell } from '../../../layouts/app-layout/page-shell/page-shell';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon';
import { IconName } from '../../../shared/ui/icon/icons';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { ProfileMenu } from '../components/profile-menu/profile-menu';

const BIO_LIMIT = 300;

const NETWORKS: readonly { id: SocialNetwork; label: string; icon: IconName }[] = [
  { id: 'linkedin', label: 'LinkedIn page', icon: 'linkedin' },
  { id: 'github', label: 'GitHub page', icon: 'git-branch' },
  { id: 'twitter', label: 'X (Twitter) page', icon: 'x' },
  { id: 'facebook', label: 'Facebook page', icon: 'users' },
  { id: 'instagram', label: 'Instagram page', icon: 'instagram' },
  { id: 'youtube', label: 'YouTube page', icon: 'youtube' },
  { id: 'website', label: 'Personal website', icon: 'globe' },
];

/** Edit profile: display name, username, bio and social links shown on the public profile. */
@Component({
  selector: 'app-edit-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Button, Icon, PageShell, LevelCard, ProfileMenu],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  private readonly api = inject(GamificationApi);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly networks = NETWORKS;
  protected readonly bioLimit = BIO_LIMIT;
  protected readonly email = signal('');
  protected readonly loaded = signal(false);
  protected readonly saving = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    fullName: ['', [Validators.required, Validators.maxLength(60)]],
    username: ['', [Validators.pattern(/^[a-zA-Z0-9]{3,20}$/)]],
    bio: ['', [Validators.maxLength(BIO_LIMIT)]],
    linkedin: [''],
    github: [''],
    twitter: [''],
    facebook: [''],
    instagram: [''],
    youtube: [''],
    website: [''],
  });

  constructor() {
    this.api.getProfile().subscribe((profile) => {
      this.email.set(profile.email);
      this.form.patchValue({
        fullName: profile.fullName,
        username: profile.username ?? '',
        bio: profile.bio,
        ...profile.socials,
      });
      this.loaded.set(true);
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.api
      .updateProfile({
        fullName: value.fullName,
        username: value.username || null,
        bio: value.bio,
        socials: Object.fromEntries(NETWORKS.map((network) => [network.id, value[network.id]])),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Profile saved.');
          void this.router.navigateByUrl('/app/profile');
        },
        error: (error: unknown) => this.toast.error(toApiError(error).message),
      });
  }
}
