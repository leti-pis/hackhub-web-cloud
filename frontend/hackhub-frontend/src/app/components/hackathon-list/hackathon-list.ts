import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hackathon } from '../../models/hackathon.model';
import { HackathonService } from '../../services/hackathon-service/hackathon-service';
import { StatoHackathon } from '../../types/statoHackathon.type';
import { HackathonCard } from '../hackathon-card/hackathon-card';

type FiltroHackathon = StatoHackathon | 'TUTTI_ATTIVI';

@Component({
  selector: 'app-hackathon-list',
  imports: [FormsModule, HackathonCard],
  templateUrl: './hackathon-list.html',
  styleUrl: './hackathon-list.scss',
})
export class HackathonList implements OnInit {
  readonly filtroSelezionato = signal<FiltroHackathon>('TUTTI_ATTIVI');
  readonly hackathons = signal<Hackathon[]>([]);

  readonly hackathonsVisibili = computed(() => {
    if (this.filtroSelezionato() === 'TUTTI_ATTIVI') {
      return this.hackathons().filter(
        hackathon => hackathon.stato !== 'CONCLUSO'
      );
    }

    return this.hackathons().filter(
      hackathon => hackathon.stato === this.filtroSelezionato()
    );
  });

  constructor(private hackathonService: HackathonService) {}

  ngOnInit(): void {
    this.hackathonService.getHackathonList().subscribe(
      {
        next: (h) => {
          this.hackathons.set(h);
        }
      });
  }
}
