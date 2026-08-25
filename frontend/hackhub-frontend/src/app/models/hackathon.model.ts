import { StatoHackathon } from '../types/statoHackathon.type';

export interface Hackathon {
  id: string;
  nome: string;
  dataInizio: string;
  dataFine: string;
  luogo: string;
  premio: number;
  teamMin: number;
  teamMax: number;
  regolamento: string;
  scadenzaIscrizioni: string;
  stato: StatoHackathon;
  numeroTeamIscritti: number;
  maxIscrizioni: number;
  postiRimanenti: number;
  nomeGiudice: string | null;
  nomeMentori: string[];
  nomeOrganizzatore: string;
}
