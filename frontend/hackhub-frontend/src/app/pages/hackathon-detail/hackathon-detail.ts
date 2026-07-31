import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from '../../services/hackathonService';
import { Hackathon } from '../../models/hackathon.model';

@Component({
  selector: 'app-hackathon-detail',
  imports: [],
  templateUrl: './hackathon-detail.html',
  styleUrl: './hackathon-detail.scss',
})
export class HackathonDetail implements OnInit {
  constructor(private route: ActivatedRoute, private hackathonService: HackathonService) {
  }

  idHackathon: string | null = null;
  
  //= hackathon: Hackathon | undefined;
  hackathon?: Hackathon;

  ngOnInit(): void {
    this.hackathonService.getHackathons().subscribe({
      next: (hackathons) => {
        this.hackathon = hackathons.find(
          hackathon => hackathon.idHackathon === this.idHackathon
        )
      },
      error: (errore) => {
        console.error("Errore nella ricerca dell'hackathon", errore)
      }
    })
    this.idHackathon = this.route.snapshot.paramMap.get('id');
    // Nel caso in cui get('id') restituisce null interrompe l'esecuzione di ngOnInit
    if (this.idHackathon === null){
      console.error('ID hackathon non presente nella rotta');
      return;
    }
    console.log('ID hackathon: ', this.idHackathon)
  }
}
