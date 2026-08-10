import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from '../../services/hackathonService';
import { Hackathon } from '../../models/hackathon.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hackathon-detail',
  imports: [NgClass],
  templateUrl: './hackathon-detail.html',
  styleUrl: './hackathon-detail.scss',
})
export class HackathonDetail implements OnInit {
  constructor(private route: ActivatedRoute, private hackathonService: HackathonService) {
  }

  id: string | null = null;
  
  //= hackathon: Hackathon | undefined;
  hackathon?: Hackathon;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    // Nel caso in cui get('id') restituisce null interrompe l'esecuzione di ngOnInit
    if (this.id === null){
      console.error('ID hackathon non presente nella rotta');
      return;
    }
    this.hackathonService.getHackathonById(this.id).subscribe(
      {
        next: (h) => {
          console.log('Hackathon ricevuto:', h);
          this.hackathon = h
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

  classeStato(stato: string): string {
    switch(stato) {
      case 'ISCRIZIONI_APERTE': return 'text-bg-success';
      case 'ISCRIZIONI_CHIUSE': return 'text-bg-secondary';
      case 'IN_CORSO': return 'text-bg-primary';
      case 'VALUTAZIONE_IN_CORSO': return 'text-bg-warning';
      default: return "text-bg-dark"
    }
  }
}
