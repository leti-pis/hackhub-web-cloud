import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hackathon-create',
  imports: [FormsModule],
  templateUrl: './hackathon-create.html',
  styleUrl: './hackathon-create.scss',
})
export class HackathonCreate {

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
  nomeMentore = '';
  nomeMentori: string[] = [];

  creaHackathon() {
    console.log(
      this.nome,
      this.dataInizio,
      this.dataFine,
      this.luogo,
      this.premio
    );
  }

  // Aggiunge un elemento vuoto che l'utente potrà editare nell'input
  aggiungiMentore() {
    this.nomeMentori.push('');
  }

  // Rimuove l'elemento alla posizione indicata
  rimuoviMentore(index: number) {
    this.nomeMentori.splice(index, 1);
  }

  // Funzione per tracciare gli elementi nel ciclo (evita bug di focus con ngModel)
  trackByFn(index: number, item: any) {
    return index;
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
