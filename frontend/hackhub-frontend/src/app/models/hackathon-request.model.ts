export interface HackathonRequest {
    nome: string;
    dataInizio: string;
    dataFine: string;
    luogo: string;
    premio: number;
    teamMin: number;
    teamMax: number;
    maxIscrizioni: number;
    regolamento: string;
    scadenzaIscrizioni: string;
    nomeGiudice: string;
    nomeMentori: string[];
}