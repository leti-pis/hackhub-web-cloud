import { Component } from '@angular/core';
import { HakathonCard } from "../hakathon-card/hakathon-card";
import { Hackathon } from '../../models/hackathon.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hackathon-list',
  imports: [FormsModule, HakathonCard],
  templateUrl: './hackathon-list.html',
  styleUrl: './hackathon-list.scss',
})
export class HackathonList {
  filtroSelezionato = 'ISCRIZIONI_APERTE';
  hackathons: Hackathon[] = [
  {
    idHackathon: 'H-123',
    nome: 'Hackathon Green Tech',
    periodo: {
      dataInizio: '2026-09-10',
      oraInizio: '09:00',
      dataFine: '2026-09-12',
      oraFine: '18:00'
    },
    luogo: 'Roma',
    premio: 5000,
    regolamento: 'regolamento',
    scadenzaIscrizioni: '2026-09-08',
    postiLiberi: 20,
    staff: [
      {
        utente: {
          nomeUtente: 'Mario Rossi'
        },
        ruolo: 'MENTORE'
      }
    ],
    stato: 'ISCRIZIONI_APERTE'
  },
  {
    idHackathon: 'H-124',
    nome: 'Hackathon Green Tech',
    periodo: {
      dataInizio: '2026-09-10',
      oraInizio: '09:00',
      dataFine: '2026-09-12',
      oraFine: '18:00'
    },
    luogo: 'Roma',
    premio: 5000,
    regolamento: 'regolamento',
    scadenzaIscrizioni: '2026-09-08',
    postiLiberi: 20,
    staff: [
      {
        utente: {
          nomeUtente: 'Mario Rossi'
        },
        ruolo: 'MENTORE'
      }
    ],
    stato: 'ISCRIZIONI_CHIUSE'
  },
  {
    idHackathon: 'H-125',
    nome: 'Hackathon Green Tech',
    periodo: {
      dataInizio: '2026-09-10',
      oraInizio: '09:00',
      dataFine: '2026-09-12',
      oraFine: '18:00'
    },
    luogo: 'Roma',
    premio: 5000,
    regolamento: 'regolamento',
    scadenzaIscrizioni: '2026-09-08',
    postiLiberi: 20,
    staff: [
      {
        utente: {
          nomeUtente: 'Mario Rossi'
        },
        ruolo: 'MENTORE'
      }
    ],
    stato: 'IN_CORSO'
  }
];

get hackathonsVisibili(): Hackathon[] {
  if(this.filtroSelezionato === 'TUTTI_ATTIVI') {
    return this.hackathons.filter(
      hackathon => hackathon.stato !== 'CONCLUSO'
    );
  }
  return this.hackathons.filter(
    hackathon => hackathon.stato === this.filtroSelezionato
  );
}

}
