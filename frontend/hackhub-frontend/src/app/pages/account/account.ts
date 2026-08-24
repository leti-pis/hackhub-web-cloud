import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../services/team/team-service';

@Component({
  selector: 'app-account',
  imports: [RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  constructor(private teamService: TeamService, private changeDetectorRef: ChangeDetectorRef) {
  }

  nomeUtente: string | null = null;
  nomeTeam: string | null = null;
  nomiMembri: string[] | null = null;
  ruolo: string | null = null;

  ngOnInit(): void {
    this.nomeUtente = localStorage.getItem('nomeUtente');
    this.teamService.getTeam().subscribe({
      next: (teamResponse) => {
        this.nomeTeam = teamResponse.nomeTeam;
        this.ruolo = teamResponse.nomeLeader === this.nomeUtente ? 'Leader' : 'Membro';
        this.nomiMembri = teamResponse.nomiMembri;
        this.changeDetectorRef.markForCheck();
      },
      error: (error) => {
        console.error('Errore nella richiesta del team:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUtente');
  }


}
