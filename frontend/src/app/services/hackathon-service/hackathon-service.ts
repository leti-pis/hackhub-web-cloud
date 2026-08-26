import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hackathon } from '../../models/hackathon.model';
import { HackathonRequest } from '../../models/hackathon-request.model';
import { IscrizioneTeamRequest } from '../../models/iscrizione-team-request.model';

@Injectable({
  providedIn: 'root',
})
export class HackathonService {
  constructor(private http: HttpClient) { }

  apiUrl = "/api/hackathon";
  getHackathonById(id: string) {
    return this.http.get<Hackathon>(`${this.apiUrl}/${id}`);
  }

  getHackathonList() {
    return this.http.get<Hackathon[]>(this.apiUrl);
  }

  postHackathon(hackathon: HackathonRequest) {
    return this.http.post<Hackathon>(this.apiUrl, hackathon);
  }

  postTeamRegistration(request: IscrizioneTeamRequest) {
    const nomeHackathon = encodeURIComponent(request.nomeHackathon);
    return this.http.post<void>(
      `${this.apiUrl}/${nomeHackathon}/iscrizioni`, {});
  }
}
