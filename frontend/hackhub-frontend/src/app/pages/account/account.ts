import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team/team-service';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  constructor(private teamService: TeamService, private authService: AuthService, private router: Router) {
  }

  nomeUtente = localStorage.getItem('nomeUtente');
  nomeTeam = signal<string | null>(null);
  nomiMembri = signal<string[] | null>(null);
  ruolo = signal<string | null>(null);
  caricamentoTeam = signal(true);

  ngOnInit(): void {
    this.nomeUtente = localStorage.getItem('nomeUtente');
    this.teamService.getTeam().pipe(
      finalize(() => {
        this.caricamentoTeam.set(false);
      })
    ).subscribe({
      next: (teamResponse) => {
        this.nomeTeam.set(teamResponse.nomeTeam);
        this.ruolo.set(teamResponse.nomeLeader === this.nomeUtente ? 'Leader' : 'Membro');
        this.nomiMembri.set(teamResponse.nomiMembri);
      },
      error: (error) => {
        console.error('Errore nella richiesta del team:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }


}
