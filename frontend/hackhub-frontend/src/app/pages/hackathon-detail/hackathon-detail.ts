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
import { StatoHackathon } from '../../types/statoHackathon.type';
import {
  classeStato,
  formattaData,
  formattaStato
} from '../../utils/hackathon-formatters';

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

  readonly formattaStato = formattaStato;
  readonly formattaData = formattaData;
  readonly classeStato = classeStato;

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
    if (!nomeUtente) {
      return of({
        hackathon,
        iscritto: false
      });
    }
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
      switchMap((h) => {
        this.hackathon.set(h);
        return this.verificaIscrizione(h);
      })
    ).subscribe({
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

  puoIscriversi(stato: StatoHackathon, postiRimanenti: number): boolean {
    return stato === 'ISCRIZIONI_APERTE' && postiRimanenti > 0 && localStorage.getItem('nomeUtente') !== null;
  }

  iscriviti(): void {
    this.preparaIscrizione();
    this.hackathonService.postTeamRegistration(this.creaRichiestaIscrizione())
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
    this.erroreIscrizione.set('');
    this.successoIscrizione.set('');
  }

  private creaRichiestaIscrizione(): IscrizioneTeamRequest {
    return {
      nomeHackathon: this.hackathon()!.nome
    };
  }

  private gestisciErroreIscrizione(errore: HttpErrorResponse) {
    if (errore.error?.message) {
      this.erroreIscrizione.set(errore.error.message);
      return;
    }
    this.erroreIscrizione.set('Errore durante l\'iscrizione. Riprova più tardi.');
  }


  
}
