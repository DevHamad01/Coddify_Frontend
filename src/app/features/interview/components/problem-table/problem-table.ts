import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { debounceTime, switchMap, tap } from 'rxjs';

import { PracticeApi } from '../../../../core/practice/practice-api';
import {
  DIFFICULTIES,
  Difficulty,
  ProblemQuery,
  ProblemSort,
  ProblemStatus,
} from '../../../../core/practice/practice.models';
import { DifficultyBadge } from '../../../../shared/ui/difficulty-badge/difficulty-badge';
import { Icon } from '../../../../shared/ui/icon/icon';

const PAGE_SIZE = 20;

const COLUMNS: readonly { id: ProblemSort; label: string }[] = [
  { id: 'number', label: '#' },
  { id: 'title', label: 'Title' },
  { id: 'topic', label: 'Topics' },
  { id: 'difficulty', label: 'Difficulty' },
];

/** The full problem bank: search, filters, sortable columns and pagination (server side). */
@Component({
  selector: 'app-problem-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DifficultyBadge, Icon],
  templateUrl: './problem-table.html',
  styleUrl: './problem-table.scss',
})
export class ProblemTable {
  private readonly api = inject(PracticeApi);

  protected readonly columns = COLUMNS;
  protected readonly difficulties = DIFFICULTIES;
  protected readonly topics = toSignal(this.api.getTopics(), { initialValue: [] });

  protected readonly query = signal<ProblemQuery>({
    search: '',
    topic: null,
    difficulty: null,
    status: null,
    sort: 'number',
    direction: 'asc',
    page: 1,
    pageSize: PAGE_SIZE,
  });
  protected readonly loading = signal(true);

  protected readonly page = toSignal(
    toObservable(this.query).pipe(
      debounceTime(150),
      tap(() => this.loading.set(true)),
      switchMap((query) => this.api.getProblems(query)),
      tap(() => this.loading.set(false)),
    ),
  );

  protected readonly pageCount = computed(() => {
    const page = this.page();
    return page ? Math.max(1, Math.ceil(page.total / page.pageSize)) : 1;
  });

  /** 1 2 3 … 12 style page list around the current page. */
  protected readonly pageNumbers = computed<(number | null)[]>(() => {
    const total = this.pageCount();
    const current = this.query().page;
    const pages = new Set(
      [1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total),
    );
    const sorted = [...pages].sort((a, b) => a - b);
    return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [null, p] : [p]));
  });

  protected readonly rangeLabel = computed(() => {
    const page = this.page();
    if (!page || !page.total) {
      return 'No problems match';
    }
    const start = (page.page - 1) * page.pageSize + 1;
    return `Showing ${start} to ${start + page.items.length - 1} of ${page.total}`;
  });

  protected setSearch(search: string): void {
    this.query.update((q) => ({ ...q, search, page: 1 }));
  }

  protected setTopic(value: string): void {
    this.query.update((q) => ({ ...q, topic: value || null, page: 1 }));
  }

  protected setDifficulty(value: string): void {
    this.query.update((q) => ({ ...q, difficulty: (value || null) as Difficulty | null, page: 1 }));
  }

  protected setStatus(value: string): void {
    this.query.update((q) => ({ ...q, status: (value || null) as ProblemStatus | null, page: 1 }));
  }

  protected sortBy(sort: ProblemSort): void {
    this.query.update((q) => ({
      ...q,
      sort,
      direction: q.sort === sort && q.direction === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  }

  protected goTo(page: number): void {
    if (page >= 1 && page <= this.pageCount()) {
      this.query.update((q) => ({ ...q, page }));
    }
  }

  protected ariaSort(column: ProblemSort): 'ascending' | 'descending' | 'none' {
    const q = this.query();
    return q.sort !== column ? 'none' : q.direction === 'asc' ? 'ascending' : 'descending';
  }
}
