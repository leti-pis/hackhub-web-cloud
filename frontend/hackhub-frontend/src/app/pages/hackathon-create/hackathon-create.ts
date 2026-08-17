import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HackathonRequest } from '../../models/hackathon-request.model';
import { HackathonService } from '../../services/hackathon-service/hackathonService';

@Component({
  selector: 'app-hackathon-create',
  imports: [FormsModule],
  templateUrl: './hackathon-create.html',
  styleUrl: './hackathon-create.scss',
})
export class HackathonCreate {

  constructor(private hackathonService: HackathonService) {}

  nome = '';
  luogo = '';
  premio = 0;
  dataInizio = '';
  dataFine = '';
  teamMin = 3;
  teamMax = 3;
  maxIscrizioni = 1;
  regolamento = '';
  scadenzaIscrizioni = '';
  nomeGiudice = '';
  nomeMentori: string[] = [];

  creaHackathon() {
    const hackathonRequest: HackathonRequest = {
    nome: this.nome,
    luogo: this.luogo,
    premio: this.premio,
    dataInizio: this.dataInizio,
    dataFine: this.dataFine,
    teamMin: this.teamMin,
    teamMax: this.teamMax,
    maxIscrizioni: this.maxIscrizioni,
    regolamento: this.regolamento,
    scadenzaIscrizioni: this.scadenzaIscrizioni,
    nomeGiudice: this.nomeGiudice,
    nomeMentori: this.nomeMentori
  };
    this.hackathonService.postHackathon(hackathonRequest).subscribe(
      {
        next: (h) => {
          console.log('Hackathon creato:', h);
        },
        error: (errore) => {
          console.error("Errore nella creazione dell'hackathon", errore);
        }
      });
  }

  // Aggiunge un elemento vuoto che l'utente potrà editare nell'input
  aggiungiMentore() {
    this.nomeMentori.push('');
  }

  // Rimuove l'elemento alla posizione indicata
  rimuoviMentore(index: number) {
    this.nomeMentori.splice(index, 1);
  }

  oggi: string = this.dataLocaleOggi();
  oraAttuale: string = this.dataOraLocaleAttuale();

  private dataLocaleOggi(): string {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');

    return `${anno}-${mese}-${giorno}`;
  }

  private dataOraLocaleAttuale(): string {
    const adesso = new Date();
    const anno = adesso.getFullYear();
    const mese = String(adesso.getMonth() + 1).padStart(2, '0');
    const giorno = String(adesso.getDate()).padStart(2, '0');
    const ore = String(adesso.getHours()).padStart(2, '0');
    const minuti = String(adesso.getMinutes()).padStart(2, '0');

    return `${anno}-${mese}-${giorno}T${ore}:${minuti}`;
  }

  get teamMaxMinNonValidi(): boolean {
    return this.teamMin != null &&
      this.teamMax != null &&
      this.teamMax < this.teamMin;
  }

  get dateNonValide(): boolean {
    return !!this.dataInizio &&
      !!this.dataFine &&
      this.dataFine < this.dataInizio;
  }

  get scadenzaSuccessivaInizio(): boolean {
    if (!this.scadenzaIscrizioni || !this.dataInizio) {
      return false;
    }
    const inizioHackathon = `${this.dataInizio}T00:00`;
    return this.scadenzaIscrizioni >= inizioHackathon;
  }
}
