//Injectable permette di usare la classe come servizio e 
// inserirla nei componenti tramite dependency injection
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hackathon } from '../../models/hackathon.model';
import { HackathonRequest } from '../../models/hackathon-request.model';
import { IscrizioneTeamRequest } from '../../models/iscrizione-team-request.model';

@Injectable({
  //Significa che Angular crea un'unica istanza del service, disponibile in 
  // tutta l'app
  //Non è un singleton perchè si possono creare altre istanze
  providedIn: 'root',
})
export class HackathonService {
  constructor(private http: HttpClient) {}

  apiUrl = "/api/hackathon";
  getHackathonById(id: string) {
    // questo simbolo ` serve per creare le template literal 
    // (stringhe dove si può inserire direttamente il valore di variabili ${...})
    return this.http.get<Hackathon>(`${this.apiUrl}/${id}`);
  }

  postHackathon(hackathon: HackathonRequest) {
    return this.http.post<Hackathon>(this.apiUrl, hackathon);
  }

  postTeamRegistration(request: IscrizioneTeamRequest) {
    return this.http.post(`${this.apiUrl}/${request.nomeHackathon}/iscrizioni`, request);
  }

  getIscrizioniUtente(nomeHackathon: string) {
    return this.http.get<Hackathon[]>(`${this.apiUrl}/${nomeHackathon}/iscrizioni`, );
  }
}
