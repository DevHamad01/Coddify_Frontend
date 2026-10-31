import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PracticeApi } from '../../../../core/practice/practice-api';
import {
  CHALLENGE_LANGUAGES,
  Challenge,
  DIFFICULTIES,
  Difficulty,
  Page,
} from '../../../../core/practice/practice.models';
import { TechId, findTech } from '../../../../shared/data/tech';
import { Button } from '../../../../shared/ui/button/button';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';
import { Icon } from '../../../../shared/ui/icon/icon';
import { TechLogo } from '../../../../shared/ui/tech-logo/tech-logo';
import { FilterDropdown, FilterOption } from '../filter-dropdown/filter-dropdown';

const PAGE_SIZE = 20;

/** The free challenge bank: filter by language and difficulty, page through, open one. */
@Component({
  selector: 'app-challenge-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, DifficultyBadge, Icon, TechLogo, FilterDropdown],
  templateUrl: './challenge-list.html',
  styleUrl: './challenge-list.scss',
})
export class ChallengeList {
  private readonly api = inject(PracticeApi);
  private readonly router = inject(Router);

  protected readonly languageOptions: readonly FilterOption[] = CHALLENGE_LANGUAGES.map((id) => ({
    value: id,
    label: findTech(id).name,
  }));
  protected readonly difficultyOptions: readonly FilterOption[] = DIFFICULTIES.map((level) => ({
    value: level,
    label: level,
  }));

  protected readonly languages = signal<readonly string[]>(['python']);
  protected readonly difficulties = signal<readonly string[]>([]);
  protected readonly page = signal(1);
  protected readonly result = signal<Page<Challenge> | null>(null);
  protected readonly loading = signal(false);

  protected readonly pages = computed(() => {
    const result = this.result();
    return result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  });
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.pages() }, (_, i) => i + 1),
  );
  protected readonly techName = (id: TechId) => findTech(id).name;

  constructor() {
    effect(() => {
      const query = {
        languages: this.languages() as TechId[],
        difficulties: this.difficulties() as Difficulty[],
        page: this.page(),
        pageSize: PAGE_SIZE,
      };
      this.loading.set(true);
      this.api.getChallenges(query).subscribe((result) => {
        this.result.set(result);
        this.loading.set(false);
      });
    });
  }

  protected setLanguages(languages: readonly string[]): void {
    this.languages.set(languages);
    this.page.set(1);
  }

  protected setDifficulties(difficulties: readonly string[]): void {
    this.difficulties.set(difficulties);
    this.page.set(1);
  }

  /** Same challenge for everyone on a given day. */
  protected openDaily(): void {
    const items = this.result()?.items ?? [];
    if (items.length) {
      const day = Math.floor(Date.now() / 86_400_000);
      void this.router.navigate(['/practice/problem', items[day % items.length].id]);
    }
  }
}
