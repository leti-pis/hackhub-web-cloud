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
}
