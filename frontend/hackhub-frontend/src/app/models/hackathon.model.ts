import { StatoHackathon } from "../types/statoHackathon.type";
import { Periodo } from "./periodo.model";
import { Staff } from "./staff.model";

export interface Hackathon {
    idHackathon: string;
    nome: string;
    periodo: Periodo;
    luogo: string;
    premio: number;
    regolamento: string;
    scadenzaIscrizioni: string;
    postiLiberi: number;
    staff: Staff[];
    stato: StatoHackathon;
}