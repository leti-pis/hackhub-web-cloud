import { StatoHackathon } from "../types/statoHackathon.type";
import { Periodo } from "./periodo.model";
import { Staff } from "./staff.model";

export interface Hackathon {
    id: string;
    nome: string;
    dataInizio: string,
    dataFine: string,
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