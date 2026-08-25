import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from '../../services/hackathon-service/hackathon-service';
import { Hackathon } from '../../models/hackathon.model';
import { NgClass } from '@angular/common';
import { TeamService } from '../../services/team/team-service';
import { of, Observable, finalize, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IscrizioneTeamRequest } from '../../models/iscrizione-team-request.model';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-hackathon-detail',
  imports: [NgClass],
  templateUrl: './hackathon-detail.html',
  styleUrl: './hackathon-detail.scss',
})
export class HackathonDetail implements OnInit {
  constructor(private route: ActivatedRoute, private hackathonService: HackathonService, private teamService: TeamService, private authService: AuthService) {
  }

  id: string | null = null;
  hackathon = signal<Hackathon | undefined>(undefined);

  erroreIscrizione = signal('');
  successoIscrizione = signal('');
  erroreCaricamento = signal('');

  iscrizioneInCorso = signal(false);
  iscritto = signal(false);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.id = this.getHackathonId();
    if (this.id === null) {
      console.error('ID hackathon non presente nella rotta');
      return;
    }
    this.caricaHackathon(this.id);
  }

  private getHackathonId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private verificaIscrizione(hackathon: Hackathon): Observable<{ hackathon: Hackathon; iscritto: boolean }> {
    const nomeUtente = localStorage.getItem('nomeUtente');
    // Se l'utente non è loggato, restituisci un Observable che emette un oggetto con hackathon e iscritto impostato a false.
    if (!nomeUtente) {
      //return of è un operatore di RxJS che crea un Observable che emette un singolo valore e poi completa.
      return of({
        hackathon,
        iscritto: false
      });
    }
    // Se l'utente è loggato, chiama il servizio TeamService per ottenere le iscrizioni del team e verifica se l'hackathon corrente è tra le iscrizioni.
    return this.teamService.getIscrizioniTeam().pipe(
      map((iscrizioni) => ({
        hackathon,
        iscritto: iscrizioni.includes(hackathon.nome)
      })),
      catchError((errore: HttpErrorResponse) => {
        if (errore.status === 404) {
          return of({
            hackathon,
            iscritto: false
          });
        }
        return throwError(() => errore);
      })
    );
  }

  private caricaHackathon(id: string): void {
    this.hackathonService.getHackathonById(id).pipe(
      // switchMap viene utilizzato per trasformare l'Observable emesso da getHackathonById in un nuovo Observable che verifica
      //  se l'utente è iscritto all'hackathon. In pratica, prende l'hackathon ottenuto e lo passa alla funzione 
      // verificaIscrizione, che restituisce un nuovo Observable con le informazioni sull'iscrizione.
      switchMap((h) => {
        this.hackathon.set(h);
        return this.verificaIscrizione(h);
      })
      // subscribe viene utilizzato per iscriversi all'Observable risultante. Quando l'Observable emette un valore,
      // la funzione next viene chiamata con l'oggetto che contiene le informazioni sull'hackathon e se l'utente è iscritto.
    ).subscribe({
      // le parentesi attorno a { iscritto } indicano che stiamo usando la destrutturazione dell'oggetto restituito 
      // dall'Observable. In questo caso, l'oggetto ha due proprietà: hackathon e iscritto. Stiamo estraendo solo la 
      // proprietà iscritto e la stiamo usando per aggiornare il segnale iscritto.
      next: ({ iscritto }) => {
        this.iscritto.set(iscritto);
      },
      error: (error) => {
        console.error('Errore durante il recupero dei dettagli dell\'hackathon:', error);
        this.erroreCaricamento.set('Errore durante il recupero dei dettagli dell\'hackathon.');
      }
    }
    )
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
    switch (stato) {
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
    this.preparaIscrizione();
    this.hackathonService.postTeamRegistration(this.creaRichiestaIscrizione())
      // finalize viene utilizzato per eseguire un'azione al termine dell'osservabile, 
      // indipendentemente dal fatto che sia stato completato con successo o con errore. 
      // In questo caso, viene utilizzato per impostare iscrizioneInCorso a false al termine della richiesta.
      .pipe(
        switchMap(() => {
          return this.hackathonService.getHackathonById(this.hackathon()!.id);
        }),
        finalize(() => {
          this.iscrizioneInCorso.set(false);
        })
      ).subscribe({
        next: (h) => {
          this.hackathon.set(h);
          this.iscritto.set(true);
          this.successoIscrizione.set('Iscrizione avvenuta con successo!');
        },
        error: (errore) => {
          this.gestisciErroreIscrizione(errore);
        }
      });
  }

  private preparaIscrizione(): void {
    this.iscrizioneInCorso.set(true);
    this.erroreIscrizione.set(''); // Reset dell'errore prima di effettuare la richiesta
    this.successoIscrizione.set(''); // Reset del successo prima di effettuare la richiesta
  }

  private creaRichiestaIscrizione(): IscrizioneTeamRequest {
    return {
      nomeUtente: localStorage.getItem('nomeUtente') || '',
      nomeHackathon: this.hackathon()!.nome
    };
  }

  // HttpErrorResponse è una classe di Angular che rappresenta un errore HTTP. Rispetto a any, HttpErrorResponse 
  // fornisce proprietà specifiche per gli errori HTTP, come status, statusText, error, ecc.
  private gestisciErroreIscrizione(errore: HttpErrorResponse) {
    if (errore.error?.message) {
      this.erroreIscrizione.set(errore.error.message);
      return;
    }
    this.erroreIscrizione.set('Errore durante l\'iscrizione. Riprova più tardi.');
  }


  
}
