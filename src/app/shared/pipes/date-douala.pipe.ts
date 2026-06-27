import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDouala',
  standalone: true
})
export class DateDoualaPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    // Convert to Douala timezone (UTC+1)
    const offset = 1; // UTC+1
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const doualaTime = new Date(utc + (3600000 * offset));

    return doualaTime.toLocaleString('fr-CM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
}