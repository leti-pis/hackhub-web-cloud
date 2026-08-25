import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hackathon } from '../../models/hackathon.model';
import { classeStato, formattaData, formattaStato } from '../../utils/hackathon-formatters';

@Component({
  selector: 'app-hackathon-card',
  imports: [NgClass, RouterLink],
  templateUrl: './hackathon-card.html',
  styleUrl: './hackathon-card.scss',
})
export class HackathonCard {
  readonly hackathon = input.required<Hackathon>();
  readonly formattaStato = formattaStato;
  readonly formattaData = formattaData;
  readonly classeStato = classeStato;
}
