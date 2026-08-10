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
        "id": "H-3e198822-391b-45de-936a-feb2819dec4a",
        "nome": "PROVA3",
        "dataInizio": "2027-02-19",
        "dataFine": "2027-02-21",
        "luogo": "Camerino",
        "premio": 6000.00,
        "teamMin": 3,
        "teamMax": 6,
        "regolamento": "Sviluppare una soluzione basata su intelligenza artificiale per supportare studenti, docenti o istituzioni formative. Il team deve dichiarare eventuali modelli, dataset e servizi esterni utilizzati.",
        "scadenzaIscrizioni": "2027-02-08T23:59:00",
        "stato": "ISCRIZIONI_APERTE",
        "numeroTeamIscritti": 0,
        "maxIscrizioni": 30,
        "postiRimanenti": 30,
        "nomeGiudice": null,
        "nomeMentori": [],
        "nomeOrganizzatore": "Organizzatore"
    },
    {
        "id": "H-59277858-85b1-45c4-979b-0e69e8f3bc30",
        "nome": "PROVA1",
        "dataInizio": "2027-02-19",
        "dataFine": "2027-02-21",
        "luogo": "Camerino",
        "premio": 6000.00,
        "teamMin": 3,
        "teamMax": 6,
        "regolamento": "Sviluppare una soluzione basata su intelligenza artificiale per supportare studenti, docenti o istituzioni formative. Il team deve dichiarare eventuali modelli, dataset e servizi esterni utilizzati.",
        "scadenzaIscrizioni": "2027-02-08T23:59:00",
        "stato": "ISCRIZIONI_APERTE",
        "numeroTeamIscritti": 0,
        "maxIscrizioni": 30,
        "postiRimanenti": 30,
        "nomeGiudice": null,
        "nomeMentori": [],
        "nomeOrganizzatore": "Organizzatore"
    },
    {
        "id": "H-74768733-5dbc-4d5a-a944-a67d909a7278",
        "nome": "PROVA4",
        "dataInizio": "2027-02-19",
        "dataFine": "2027-02-21",
        "luogo": "Camerino",
        "premio": 6000.00,
        "teamMin": 3,
        "teamMax": 6,
        "regolamento": "Sviluppare una soluzione basata su intelligenza artificiale per supportare studenti, docenti o istituzioni formative. Il team deve dichiarare eventuali modelli, dataset e servizi esterni utilizzati.",
        "scadenzaIscrizioni": "2027-02-08T23:59:00",
        "stato": "ISCRIZIONI_APERTE",
        "numeroTeamIscritti": 0,
        "maxIscrizioni": 30,
        "postiRimanenti": 30,
        "nomeGiudice": null,
        "nomeMentori": [],
        "nomeOrganizzatore": "Organizzatore"
    },
    {
        "id": "H-9c9b4903-670a-4e72-9d73-80c2bc24aaee",
        "nome": "PROVA2",
        "dataInizio": "2027-02-19",
        "dataFine": "2027-02-21",
        "luogo": "Camerino",
        "premio": 6000.00,
        "teamMin": 3,
        "teamMax": 6,
        "regolamento": "Sviluppare una soluzione basata su intelligenza artificiale per supportare studenti, docenti o istituzioni formative. Il team deve dichiarare eventuali modelli, dataset e servizi esterni utilizzati.",
        "scadenzaIscrizioni": "2027-02-08T23:59:00",
        "stato": "ISCRIZIONI_APERTE",
        "numeroTeamIscritti": 0,
        "maxIscrizioni": 30,
        "postiRimanenti": 30,
        "nomeGiudice": null,
        "nomeMentori": [],
        "nomeOrganizzatore": "Organizzatore"
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
