package unicam.cs.hackhub.servizi;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import unicam.cs.hackhub.boundary.dto.HackathonRequest;
import unicam.cs.hackhub.domain.RuoloStaff;
import unicam.cs.hackhub.domain.StatoEnum;
import unicam.cs.hackhub.domain.StatoRichiesta;
import unicam.cs.hackhub.domain.implementazione.Hackathon;
import unicam.cs.hackhub.domain.implementazione.InvitoStaff;
import unicam.cs.hackhub.domain.implementazione.Richiesta;
import unicam.cs.hackhub.domain.implementazione.Utente;
import unicam.cs.hackhub.eccezioni.ConflictException;
import unicam.cs.hackhub.handler.CreaHackathonHandler;
import unicam.cs.hackhub.handler.GestisciRichiesteHandler;
import unicam.cs.hackhub.repository.*;
import unicam.cs.hackhub.servizi.esterni.CalendarioMock;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InvitiStaffTest {

    private final RepositoryUtente repositoryUtente = mock(RepositoryUtente.class);
    private final RepositoryRichiesta repositoryRichiesta = mock(RepositoryRichiesta.class);
    private final RepositoryHackathon repositoryHackathon = mock(RepositoryHackathon.class);
    private final ServizioNotifiche servizioNotifiche = new ServizioNotifiche(
            mock(RepositoryNotifica.class), repositoryRichiesta);
    private final GestisciRichiesteHandler gestisciRichieste = new GestisciRichiesteHandler(
            repositoryUtente, repositoryRichiesta, repositoryHackathon, servizioNotifiche,
            mock(RepositoryStaff.class), mock(RepositoryMembriTeam.class), mock(CalendarioMock.class));

    @Test
    void creazioneHackathonGeneraInvitiStaffAccettabiliFinoAllaScadenzaIscrizioni() {
        Utente organizzatore = utenteRegistrato("organizzatore");
        utenteRegistrato("giudice");
        utenteRegistrato("mentore");
        LocalDate inizio = LocalDate.now().plusDays(4);
        LocalDateTime scadenzaIscrizioni = inizio.minusDays(1).atTime(18, 0);
        HackathonRequest request = new HackathonRequest(
                "Hackathon Test", inizio, inizio.plusDays(1), "Camerino",
                BigDecimal.valueOf(100), 3, 6, 10, "Regolamento",
                scadenzaIscrizioni, "giudice", List.of("mentore"));
        CreaHackathonHandler creaHackathon = new CreaHackathonHandler(
                repositoryUtente, repositoryHackathon, servizioNotifiche);

        var risposta = creaHackathon.avviaCreazioneHackathon(request, organizzatore.getNomeUtente());

        assertEquals(request.nome(), risposta.nome());
        assertEquals(organizzatore.getNomeUtente(), risposta.nomeOrganizzatore());
        assertEquals(StatoEnum.ISCRIZIONI_APERTE, risposta.stato());
        ArgumentCaptor<Hackathon> hackathonCaptor = ArgumentCaptor.forClass(Hackathon.class);
        verify(repositoryHackathon).save(hackathonCaptor.capture());
        Hackathon hackathon = hackathonCaptor.getValue();
        ArgumentCaptor<Richiesta> richiesteCaptor = ArgumentCaptor.forClass(Richiesta.class);
        verify(repositoryRichiesta, times(2)).save(richiesteCaptor.capture());
        List<InvitoStaff> inviti = richiesteCaptor.getAllValues().stream()
                .map(r -> assertInstanceOf(InvitoStaff.class, r)).toList();
        assertEquals(Set.of(RuoloStaff.GIUDICE, RuoloStaff.MENTORE),
                inviti.stream().map(InvitoStaff::getRuolo).collect(Collectors.toSet()));

        for (InvitoStaff invito : inviti) {
            assertSame(hackathon, invito.getHackathon());
            assertEquals(scadenzaIscrizioni, invito.getScadenza());
            assertTrue(invito.getScadenza().isAfter(LocalDateTime.now()));
            String nomeUtente = invito.getDestinatario().getNomeUtente();
            String idRichiesta = "R-" + nomeUtente;
            when(repositoryRichiesta.findById(idRichiesta)).thenReturn(Optional.of(invito));

            assertDoesNotThrow(() -> gestisciRichieste.accettaRichiesta(nomeUtente, idRichiesta));

            assertEquals(StatoRichiesta.ACCETTATO, invito.getStato());
            assertTrue(hackathon.getStaff().stream().anyMatch(s ->
                    s.getUtente().getNomeUtente().equals(nomeUtente) && s.getRuolo() == invito.getRuolo()));
        }
    }

    @Test
    void invitoStaffScadutoNonPuoEssereAccettatoORifiutato() {
        InvitoStaff invito = preparaInvito(LocalDateTime.now().minusDays(1));

        ConflictException errore = assertThrows(ConflictException.class,
                () -> gestisciRichieste.accettaRichiesta("mentore", "R-test"));
        assertEquals("La richiesta è scaduta", errore.getMessage());
        assertThrows(ConflictException.class,
                () -> gestisciRichieste.rifiutaRichiesta("mentore", "R-test"));
        assertEquals(StatoRichiesta.INVIATO, invito.getStato());
        assertTrue(invito.getHackathon().getStaff().isEmpty());
        verifyNoInteractions(repositoryHackathon);
    }

    @Test
    void invitoStaffNonScadutoPuoEssereRifiutato() {
        InvitoStaff invito = preparaInvito(LocalDateTime.now().plusDays(1));

        gestisciRichieste.rifiutaRichiesta("mentore", "R-test");

        assertEquals(StatoRichiesta.RIFIUTATO, invito.getStato());
        assertTrue(invito.getHackathon().getStaff().isEmpty());
        verifyNoInteractions(repositoryHackathon);
    }

    private InvitoStaff preparaInvito(LocalDateTime scadenza) {
        utenteRegistrato("organizzatore");
        Utente mentore = utenteRegistrato("mentore");
        InvitoStaff invito = new InvitoStaff("organizzatore", "Invito nello staff", mentore,
                scadenza, new Hackathon(), RuoloStaff.MENTORE);
        when(repositoryRichiesta.findById("R-test")).thenReturn(Optional.of(invito));
        return invito;
    }

    private Utente utenteRegistrato(String nomeUtente) {
        Utente utente = new Utente(nomeUtente, nomeUtente + "@example.com", "password-hash");
        when(repositoryUtente.findByNomeUtente(nomeUtente)).thenReturn(Optional.of(utente));
        return utente;
    }
}
