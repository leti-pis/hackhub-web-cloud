import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamResponse } from '../../models/team-response.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient) {}

  apiUrl = "/api/team";
  getTeam(){
    return this.http.get<TeamResponse>(`${this.apiUrl}/mio`);
  }

  getIscrizioniTeam() {
    return this.http.get<string[]>(`${this.apiUrl}/iscrizioni`);
  }
}
