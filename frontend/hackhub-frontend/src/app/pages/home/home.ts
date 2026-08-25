import { Component } from '@angular/core';
import { HackathonList } from '../../components/hackathon-list/hackathon-list';

@Component({
  selector: 'app-home',
  imports: [HackathonList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
