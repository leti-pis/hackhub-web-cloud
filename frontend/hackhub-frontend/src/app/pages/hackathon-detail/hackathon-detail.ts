import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from '../../services/hackathon-service/hackathonService';
import { Hackathon } from '../../models/hackathon.model';
import { NgClass } from '@angular/common';
import { TeamService } from '../../services/team/team-service';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-hackathon-detail',
  imports: [NgClass],
  templateUrl: './hackathon-detail.html',
  styleUrl: './hackathon-detail.scss',
})
export class HackathonDetail implements OnInit {
  constructor(private route: ActivatedRoute, private hackathonService: HackathonService, private cdr: ChangeDetectorRef, private teamService: TeamService) {
  }

  id: string | null = null;
  
  //= hackathon: Hackathon | undefined;
  hackathon?: Hackathon;

  erroreIscrizione = signal('');
  successoIscrizione = signal('');

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === null){
      console.error('ID hackathon non presente nella rotta');
      return;
    }
    this.hackathonService.getHackathonById(this.id).subscribe(
      {
        next: (h) => {
          console.log('Hackathon ricevuto:', h);
          this.hackathon = h;
          //Avverte Angular che è cambiato qualcosa che il template usa e di ricontrollare questo componente
          this.cdr.markForCheck();
        },
      error: (errore) => {
        console.error("Errore nella ricerca dell'hackathon", errore);
      }
      });
    }

    formattaStato(stato: string): string {
    return stato
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/^./, carattere => carattere.toUpperCase());
  }

  formattaData(data: string): string {
    return data.replace('T', ' ');
  }

  classeStato(stato: string): string {
    switch(stato) {
      case 'ISCRIZIONI_APERTE': return 'text-bg-success';
      case 'ISCRIZIONI_CHIUSE': return 'text-bg-secondary';
      case 'IN_CORSO': return 'text-bg-primary';
      case 'VALUTAZIONE_IN_CORSO': return 'text-bg-warning';
      default: return "text-bg-dark"
    }
  }

  puoIscriversi(stato: string, postiRimanenti: number): boolean {
    return stato === 'ISCRIZIONI_APERTE' && postiRimanenti > 0 && localStorage.getItem('nomeUtente') !== null;
  }

  iscriviti(): void {
    this.erroreIscrizione.set(''); // Reset dell'errore prima di effettuare la richiesta
    this.successoIscrizione.set(''); // Reset del successo prima di effettuare la richiesta
    this.hackathonService.postTeamRegistration({nomeUtente: localStorage.getItem('nomeUtente') || '', nomeHackathon: this.hackathon!.nome}).subscribe({
      next: (response) => {
        this.successoIscrizione.set('Iscrizione avvenuta con successo!');
      },
      error: (errore) => { 
        forkJoin({
          team: this.teamService.getTeam(),
        }).subscribe({
          next: ({ team}) => {
            const nomeUtente = localStorage.getItem('nomeUtente');
            const hasTeam = team !== null && team !== undefined;
            const isLeader = team?.nomeLeader === nomeUtente;
            const isAlreadyRegistered = this.isAlreadyRegistered();
            const numeroMembri = team?.nomiMembri.length || 0;
            if (!hasTeam) {
              this.erroreIscrizione.set('Devi essere in un team per poterti iscrivere a un hackathon');
              return;
            }
            if (numeroMembri < this.hackathon!.teamMin || numeroMembri > this.hackathon!.teamMax) {
              this.erroreIscrizione.set(`Il tuo team deve avere tra ${this.hackathon!.teamMin} e ${this.hackathon!.teamMax} membri per potersi iscrivere a questo hackathon`);
              return;
            }
            if (!isLeader) {
              this.erroreIscrizione.set('Solo il leader del team può iscrivere il team a un hackathon');
              return;
            }
            if (isAlreadyRegistered) {
              this.erroreIscrizione.set('Il tuo team è già iscritto a questo hackathon');
              return;
            }
            // Se non ci sono errori specifici, mostra l'errore generico
            this.erroreIscrizione.set('Errore durante l\'iscrizione: ' + errore.message);
          },
          error: (errore) => {
            console.error('Errore durante la verifica del team o delle iscrizioni:', errore);
            this.erroreIscrizione.set('Errore durante la verifica del team o delle iscrizioni: ' + errore.message);
          }
        });
      }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('nomeUtente') !== null;
  }

  //TODO
  isAlreadyRegistered(): Observable<boolean> {
    // Controlla se l'utente è già registrato all'hackathon
    const nomeUtente = localStorage.getItem('nomeUtente');
    if (!nomeUtente || !this.hackathon) {
      return of(false);
    }
    return this.teamService.getIscrizioniTeam().pipe(
      map(iscrizioni => {
        if (iscrizioni.includes(this.hackathon!.nome)) {
          return true;
        }
        return false;
      }),
      catchError(errore => {
        console.error('Errore nella verifica delle iscrizioni del team', errore);
        return of(false);
      })
    );  
  }
}
