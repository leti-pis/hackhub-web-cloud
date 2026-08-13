import { Component } from '@angular/core';
import { HackathonList } from '../../components/hackathon-list/hackathon-list';
import { HackathonCreate } from "../hackathon-create/hackathon-create";

@Component({
  selector: 'app-home',
  imports: [HackathonList, HackathonCreate],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
