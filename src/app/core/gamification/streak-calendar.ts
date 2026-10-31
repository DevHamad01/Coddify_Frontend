/** Date helpers shared by the streak popover and the streak page. Dates are local yyyy-mm-dd. */

export interface CalendarDay {
  readonly iso: string;
  readonly day: number;
  readonly isToday: boolean;
  readonly isFuture: boolean;
  readonly active: boolean;
}

export function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function toDay(date: Date, activeDays: ReadonlySet<string>, now: Date): CalendarDay {
  const iso = isoDate(date);
  const today = isoDate(now);
  return {
    iso,
    day: date.getDate(),
    isToday: iso === today,
    isFuture: iso > today,
    active: activeDays.has(iso),
  };
}

/** Sunday..Saturday of the week containing `now`. */
export function currentWeek(activeDays: readonly string[], now = new Date()): CalendarDay[] {
  const active = new Set(activeDays);
  const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return Array.from({ length: 7 }, (_, i) =>
    toDay(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i), active, now),
  );
}

/** Days of one month, padded with nulls so the first day lands under its weekday (Sunday first). */
export function monthGrid(
  year: number,
  month: number,
  activeDays: readonly string[],
  now = new Date(),
): (CalendarDay | null)[] {
  const active = new Set(activeDays);
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: days }, (_, i) => toDay(new Date(year, month, i + 1), active, now)),
  ];
}

export const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
