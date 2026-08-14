import { Component, input } from '@angular/core';
import { Hackathon } from '../../models/hackathon.model';
import { NgClass } from "../../../../node_modules/@angular/common";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hakathon-card',
  imports: [NgClass, RouterLink],
  templateUrl: './hakathon-card.html',
  styleUrl: './hakathon-card.scss',
})
export class HakathonCard {
  hackathon = input.required<Hackathon>();

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

}
