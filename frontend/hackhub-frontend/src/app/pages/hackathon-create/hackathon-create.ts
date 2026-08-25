import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HackathonRequest } from '../../models/hackathon-request.model';
import { HackathonService } from '../../services/hackathon-service/hackathon-service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hackathon-create',
  imports: [FormsModule],
  templateUrl: './hackathon-create.html',
  styleUrl: './hackathon-create.scss',
})
export class HackathonCreate {

  constructor(private hackathonService: HackathonService, private router: Router) { }

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
  nomeMentori: { id: number; nome: string }[] = [];

  private prossimoMentoreId = 0;

  error = signal<string>('');

  caricamento = signal(false);

  creaHackathon() {
    const hackathonRequest = this.preparazioneCreazione();
    this.hackathonService.postHackathon(hackathonRequest).pipe(
      finalize(() => {
        this.caricamento.set(false);
      })
    ).subscribe(
      {
        next: (h) => {
          this.router.navigate(['/hackathons', h.id]);
        },
        error: (errore: HttpErrorResponse) => {
          this.gestisciErrore(errore);
        }
      });
  }

  private preparazioneCreazione(): HackathonRequest {
    this.error.set('');
    this.caricamento.set(true);
    const hackathonRequest: HackathonRequest = {
      nome: this.normalizzaTesto(this.nome),
      luogo: this.normalizzaTesto(this.luogo),
      premio: this.premio,
      dataInizio: this.dataInizio,
      dataFine: this.dataFine,
      teamMin: this.teamMin,
      teamMax: this.teamMax,
      maxIscrizioni: this.maxIscrizioni,
      regolamento: this.normalizzaTesto(this.regolamento),
      scadenzaIscrizioni: this.scadenzaIscrizioni,
      nomeGiudice: this.normalizzaTesto(this.nomeGiudice),
      nomeMentori: this.nomeMentori.map(
        mentore => this.normalizzaTesto(mentore.nome)
      )
    };
    return hackathonRequest;
  }

  private gestisciErrore(errore: HttpErrorResponse) {
    if (errore.status === 409 && errore.error?.message) {
      this.error.set(errore.error.message);
      return;
    }
    if (errore.status === 400 && errore.error?.message) {
      this.error.set(errore.error.message);
      return;
    }
    if (errore.status === 0) {
      this.error.set('Impossibile raggiungere il server. Controlla la connessione e riprova.');
      return;
    }
    if (errore.status >= 500) {
      this.error.set('Errore del server. Riprova più tardi.');
      return;
    }
    this.error.set('Errore nella creazione dell\'hackathon.');
  }

  aggiungiMentore(): void {
    this.nomeMentori.push({
      id: this.prossimoMentoreId++,
      nome: ''
    });
  }

  rimuoviMentore(index: number): void {
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

  get dataInizioPassata(): boolean {
    return !!this.dataInizio && this.dataInizio < this.oggi;
  }

  get scadenzaPassata(): boolean {
    return !!this.scadenzaIscrizioni &&
      this.scadenzaIscrizioni < this.oraAttuale;
  }

  private normalizzaTesto(valore: string): string {
    return valore.trim();
  }

  isBlank(valore: string): boolean {
    return !valore || valore.trim().length === 0;
  }
  get mentoriDuplicati(): boolean {
  const mentoriNormalizzati = this.nomeMentori
    .map(mentore => mentore.nome.trim())
    .filter(nome => nome.length > 0);

  return new Set(mentoriNormalizzati).size !== mentoriNormalizzati.length;
}

  get giudiceTraMentori(): boolean {
    const giudice = this.nomeGiudice.trim();
    if (!giudice) {
      return false;
    }
    return this.nomeMentori
      .map(mentore => mentore.nome.trim())
      .includes(giudice);
  }

  get mentoreVuoto(): boolean {
    return this.nomeMentori.some(mentore => this.isBlank(mentore.nome));
  }
}
