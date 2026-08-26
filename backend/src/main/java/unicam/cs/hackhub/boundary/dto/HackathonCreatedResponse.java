package unicam.cs.hackhub.boundary.dto;

import unicam.cs.hackhub.domain.StatoEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record HackathonCreatedResponse(
        String id,
        String nome,
        LocalDate dataInizio,
        LocalDate dataFine,
        String luogo,
        BigDecimal premio,
        int teamMin,
        int teamMax,
        String regolamento,
        LocalDateTime scadenzaIscrizioni,
        StatoEnum stato,
        int numeroTeamIscritti,
        int maxIscrizioni,
        int postiRimanenti,
        String nomeGiudice,
        List<String> nomeMentori,
        String nomeOrganizzatore
) {
}
