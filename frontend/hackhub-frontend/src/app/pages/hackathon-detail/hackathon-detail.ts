import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hackathon-detail',
  imports: [],
  templateUrl: './hackathon-detail.html',
  styleUrl: './hackathon-detail.scss',
})
export class HackathonDetail implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  idHackathon: string | null = null;

  ngOnInit(): void {
    this.idHackathon = this.route.snapshot.paramMap.get('id');
    // Nel caso in cui get('id') restituisce null interrompe l'esecuzione di ngOnInit
    if (this.idHackathon === null){
      console.error('ID hackathon non presente nella rotta');
      return;
    }
    console.log('ID hackathon: ', this.idHackathon)
  }
}
