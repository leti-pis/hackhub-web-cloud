import { StatoHackathon } from '../types/statoHackathon.type';

export function formattaStato(stato: StatoHackathon): string {
  return stato
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/^./, carattere => carattere.toUpperCase());
}

export function formattaData(data: string): string {
  return data.replace('T', ' ');
}

export function classeStato(stato: StatoHackathon): string {
  switch (stato) {
    case 'ISCRIZIONI_APERTE':
      return 'text-bg-success';
    case 'ISCRIZIONI_CHIUSE':
      return 'text-bg-secondary';
    case 'IN_CORSO':
      return 'text-bg-primary';
    case 'VALUTAZIONE_IN_CORSO':
      return 'text-bg-warning';
    default:
      return 'text-bg-dark';
  }
}
