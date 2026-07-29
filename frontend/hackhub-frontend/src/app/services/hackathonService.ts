//Injectable permette di usare la classe come servizio e 
// inserirla nei componenti tramite dependency injection
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hackathon } from '../models/hackathon.model';

@Injectable({
  //Significa che Angular crea un'unica istanza del service, disponibile in 
  // tutta l'app
  //Non è un singleton perchè si possono creare altre istanze
  providedIn: 'root',
})
export class HackathonService {
  constructor(private http: HttpClient) {}

  apiUrl = "GET /api/hackathon";
  getHackathons() {
    return this.http.get<Hackathon[]>(this.apiUrl)
  }
}
