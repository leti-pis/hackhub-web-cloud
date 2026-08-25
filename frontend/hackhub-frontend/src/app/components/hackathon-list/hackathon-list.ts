import { Component, OnInit, signal, computed } from '@angular/core';
import { HakathonCard } from "../hakathon-card/hakathon-card";
import { Hackathon } from '../../models/hackathon.model';
import { FormsModule } from '@angular/forms';
import { HackathonService } from '../../services/hackathon-service/hackathon-service';

@Component({
  selector: 'app-hackathon-list',
  imports: [FormsModule, HakathonCard],
  templateUrl: './hackathon-list.html',
  styleUrl: './hackathon-list.scss',
})
export class HackathonList implements OnInit {

  constructor(private hackathonService: HackathonService) {
  }

  filtroSelezionato = signal<string>('TUTTI_ATTIVI');
  hackathons = signal<Hackathon[]>([]);

  ngOnInit() {
    this.hackathonService.getHackathonList().subscribe(
      {
        next: (h) => {
          this.hackathons.set(h);
        },
        error: (errore) => {
          console.error("Errore nella ricerca degli hackathon", errore);
        }
      });
  }

// computed è un metodo che permette di creare una proprietà calcolata, che si aggiorna automaticamente quando le proprietà da cui dipende cambiano
hackathonsVisibili = computed(() => {
  if(this.filtroSelezionato() === 'TUTTI_ATTIVI') {
    return this.hackathons().filter(
      hackathon => hackathon.stato !== 'CONCLUSO'
    );
  }
  return this.hackathons().filter(
    hackathon => hackathon.stato === this.filtroSelezionato()
  );
});

}
