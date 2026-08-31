package unicam.cs.hackhub.servizi;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import unicam.cs.hackhub.domain.RuoloStaff;
import unicam.cs.hackhub.domain.RuoloTeam;
import unicam.cs.hackhub.domain.StatoEnum;
import unicam.cs.hackhub.domain.StatoRichiesta;
import unicam.cs.hackhub.domain.implementazione.Hackathon;
import unicam.cs.hackhub.domain.implementazione.MembroTeam;
import unicam.cs.hackhub.domain.implementazione.Staff;
import unicam.cs.hackhub.domain.implementazione.Team;
import unicam.cs.hackhub.domain.implementazione.Utente;
import unicam.cs.hackhub.handler.CreaTeamHandler;
import unicam.cs.hackhub.handler.GestisciTeamHandler;
import unicam.cs.hackhub.handler.IscriviTeamHandler;
import unicam.cs.hackhub.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.demo-data.enabled=true",
        "spring.datasource.url=jdbc:h2:mem:hackhub-demo-test;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
})
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class DemoDataInitializerIT {

    private static final List<String> ACCOUNT = List.of(
            "leader1", "membro1", "membro2", "organizzatore1", "giudice1", "mentore1");

    @Autowired private DemoDataInitializer initializer;
    @Autowired private RepositoryUtente utenti;
    @Autowired private RepositoryTeam team;
    @Autowired private RepositoryMembriTeam membri;
    @Autowired private RepositoryHackathon hackathon;
    @Autowired private RepositoryStaff staff;
    @Autowired private RepositoryRichiesta richieste;
    @Autowired private RepositoryNotifica notifiche;
    @Autowired private RepositoryIscrizioniTeam iscrizioni;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private CreaTeamHandler creaTeam;
    @Autowired private GestisciTeamHandler gestisciTeam;
    @Autowired private IscriviTeamHandler iscriviTeam;
    @Autowired private MockMvc mockMvc;
    @Autowired private EntityManager entityManager;

    @MockitoBean private SchedulerHackathon schedulerHackathon;

    @Test
    void avvioAutomaticoCreaAccountAutenticabiliETeamConStaffEDateValidi() throws Exception {
        assertEquals(6, utenti.count());
        assertEquals(1, team.count());
        assertEquals(3, membri.count());
        assertEquals(1, hackathon.count());
        assertEquals(3, staff.count());
        assertEquals(0, iscrizioni.count());
        for (String nome : ACCOUNT) {
            Utente utente = utenti.findByNomeUtente(nome).orElseThrow();
            assertNotEquals("Demo123!", utente.getPasswordHash());
            assertTrue(passwordEncoder.matches("Demo123!", utente.getPasswordHash()));
            mockMvc.perform(post("/api/autenticazione/accesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"nomeUtente\":\"" + nome + "\",\"password\":\"Demo123!\"}"))
                    .andExpect(status().isOk());
        }

        var rispostaTeam = gestisciTeam.visualizzaTeam("leader1");
        assertEquals("Team Alpha", rispostaTeam.nomeTeam());
        assertEquals("leader1", rispostaTeam.nomeLeader());
        assertEquals(Set.of("leader1", "membro1", "membro2"), Set.copyOf(rispostaTeam.nomiMembri()));
        assertEquals(RuoloTeam.LEADER, membri.findByUtente_NomeUtente("leader1").orElseThrow().getRuolo());
        assertEquals(RuoloTeam.MEMBRO, membri.findByUtente_NomeUtente("membro1").orElseThrow().getRuolo());
        assertEquals(RuoloTeam.MEMBRO, membri.findByUtente_NomeUtente("membro2").orElseThrow().getRuolo());

        Hackathon evento = eventoDemo();
        assertEquals(StatoEnum.ISCRIZIONI_APERTE, evento.getStatoEnum());
        assertTrue(evento.getPeriodo().getDataInizio().isAfter(LocalDate.now()));
        assertEquals(evento.getPeriodo().getDataInizio().plusDays(2), evento.getPeriodo().getDataFine());
        assertTrue(evento.getScadenzaIscrizioni().isAfter(LocalDateTime.now()));
        assertTrue(evento.getScadenzaIscrizioni().isBefore(evento.getPeriodo().getDataInizio().atStartOfDay()));
        assertEquals(3, evento.getTeamMin());
        assertEquals(6, evento.getTeamMax());
        assertEquals(10, evento.getMaxIscrizioni());
        assertEquals(Map.of("organizzatore1", RuoloStaff.ORGANIZZATORE,
                        "giudice1", RuoloStaff.GIUDICE, "mentore1", RuoloStaff.MENTORE),
                staff.findAll().stream().collect(Collectors.toMap(s -> s.getUtente().getNomeUtente(), Staff::getRuolo)));
        assertTrue(staff.findAll().stream().allMatch(s ->
                s.getHackathon().getIdHackathon().equals(evento.getIdHackathon())));
        assertEquals(2, richieste.count());
        assertTrue(richieste.findAll().stream().allMatch(r -> r.getStato() == StatoRichiesta.ACCETTATO));
    }

    @Test
    void dueEsecuzioniConsecutiveNonDuplicanoDatiORelazioni() {
        // Nessuna transazione di test: ogni run deve completare e persistere la propria transazione.
        Map<String, List<String>> accountPrima = datiAccount();
        List<Long> conteggiPrima = conteggi();
        Set<String> idMembriPrima = membri.findAll().stream().map(MembroTeam::getIdMembroTeam).collect(Collectors.toSet());
        Set<String> idStaffPrima = staff.findAll().stream().map(Staff::getIdStaff).collect(Collectors.toSet());
        Hackathon eventoPrima = eventoDemo();
        String idTeamPrima = team.findByNome("Team Alpha").orElseThrow().getIdTeam();

        initializer.run();
        initializer.run();

        assertEquals(conteggiPrima, conteggi());
        assertEquals(accountPrima, datiAccount());
        assertEquals(idMembriPrima, membri.findAll().stream().map(MembroTeam::getIdMembroTeam).collect(Collectors.toSet()));
        assertEquals(idStaffPrima, staff.findAll().stream().map(Staff::getIdStaff).collect(Collectors.toSet()));
        assertEquals(idTeamPrima, team.findByNome("Team Alpha").orElseThrow().getIdTeam());
        assertEquals(eventoPrima.getIdHackathon(), eventoDemo().getIdHackathon());
        assertEquals(eventoPrima.getPeriodo().getDataInizio(), eventoDemo().getPeriodo().getDataInizio());
        assertEquals(eventoPrima.getScadenzaIscrizioni(), eventoDemo().getScadenzaIscrizioni());
    }

    @Test
    @Transactional
    void teamDemoPuoIscriversiConIlCasoDUsoEsistente() {
        iscriviTeam.avviaIscrizioneHackathon("leader1", "HackHub Demo");
        entityManager.flush();
        entityManager.clear();

        initializer.run();

        assertEquals(1, iscrizioni.count());
        assertEquals(List.of(eventoDemo().getIdHackathon()), gestisciTeam.visualizzaIscrizioniTeam("leader1"));
    }

    @Test
    @Transactional
    void completaDatabaseParzialeSenzaSovrascrivereAccountEsistenti() {
        svuotaDatiDemo();
        String hashEsistente = passwordEncoder.encode("PasswordEsistente!");
        Utente leader = utenti.saveAndFlush(new Utente("leader1", "email-esistente@example.com", hashEsistente));
        Utente altro = utenti.saveAndFlush(new Utente("altroUtente", "altro@example.com", hashEsistente));
        String idLeader = leader.getIdUtente();

        initializer.run();
        entityManager.flush();
        entityManager.clear();
        initializer.run();

        Utente conservato = utenti.findByNomeUtente("leader1").orElseThrow();
        assertEquals(idLeader, conservato.getIdUtente());
        assertEquals("email-esistente@example.com", conservato.getEmail());
        assertEquals(hashEsistente, conservato.getPasswordHash());
        assertTrue(utenti.existsById(altro.getIdUtente()));
        assertEquals(List.of(7L, 1L, 3L, 1L, 3L, 2L, 2L, 0L), conteggi());
    }

    @Test
    @Transactional
    void conservaTeamEStaffModificatiDuranteLaDemo() {
        gestisciTeam.trasferisceRuoloLeader("leader1", "membro1");
        Hackathon evento = eventoDemo();
        evento.chiudiIscrizioni();
        evento.getStaff().removeIf(s -> s.getRuolo() == RuoloStaff.MENTORE);
        hackathon.saveAndFlush(evento);
        entityManager.clear();

        initializer.run();

        assertEquals("membro1", gestisciTeam.visualizzaTeam("leader1").nomeLeader());
        assertEquals(StatoEnum.ISCRIZIONI_CHIUSE, eventoDemo().getStatoEnum());
        assertEquals(2, staff.count());
        assertEquals(2, richieste.count());
    }

    @Test
    @Transactional
    void nonModificaUnTeamOmonimoPreesistente() {
        svuotaDatiDemo();
        utenti.save(new Utente("leaderEsistente", "esistente@example.com", passwordEncoder.encode("Esistente!")));
        creaTeam.avviaCreazioneTeam("leaderEsistente", "Team Alpha");
        String idTeam = team.findByNome("Team Alpha").orElseThrow().getIdTeam();

        initializer.run();
        entityManager.flush();
        entityManager.clear();

        assertEquals(idTeam, team.findByNome("Team Alpha").orElseThrow().getIdTeam());
        assertEquals(List.of("leaderEsistente"), gestisciTeam.visualizzaTeam("leaderEsistente").nomiMembri());
        assertTrue(membri.findByUtente_NomeUtente("leader1").isEmpty());
        assertEquals(1, team.count());
        assertEquals(1, hackathon.count());
    }

    @Test
    @Transactional
    void nonSpostaLeaderGiaAssociatoAUnAltroTeam() {
        svuotaDatiDemo();
        utenti.save(new Utente("leader1", "leader@example.com", passwordEncoder.encode("Esistente!")));
        creaTeam.avviaCreazioneTeam("leader1", "Team esistente");

        initializer.run();
        initializer.run();

        assertEquals("Team esistente", gestisciTeam.visualizzaTeam("leader1").nomeTeam());
        assertFalse(team.existsByNome("Team Alpha"));
        assertEquals(1, team.count());
        assertEquals(1, hackathon.count());
    }

    @Test
    @Transactional
    void nonSpostaMembriGiaAssociatiAUnAltroTeam() {
        svuotaDatiDemo();
        utenti.save(new Utente("membro1", "membro@example.com", passwordEncoder.encode("Esistente!")));
        creaTeam.avviaCreazioneTeam("membro1", "Team esistente");

        initializer.run();
        entityManager.flush();
        entityManager.clear();
        initializer.run();

        assertEquals("Team esistente", gestisciTeam.visualizzaTeam("membro1").nomeTeam());
        assertEquals(Set.of("leader1", "membro2"), Set.copyOf(gestisciTeam.visualizzaTeam("leader1").nomiMembri()));
        assertEquals(2, team.count());
        assertEquals(3, membri.count());
    }

    private Hackathon eventoDemo() {
        return hackathon.findByNome("HackHub Demo").orElseThrow();
    }

    private Map<String, List<String>> datiAccount() {
        return utenti.findAll().stream().collect(Collectors.toMap(Utente::getNomeUtente,
                u -> List.of(u.getIdUtente(), u.getEmail(), u.getPasswordHash())));
    }

    private List<Long> conteggi() {
        return List.of(utenti.count(), team.count(), membri.count(), hackathon.count(),
                staff.count(), richieste.count(), notifiche.count(), iscrizioni.count());
    }

    private void svuotaDatiDemo() {
        notifiche.deleteAllInBatch();
        richieste.deleteAllInBatch();
        iscrizioni.deleteAllInBatch();
        staff.deleteAllInBatch();
        membri.deleteAllInBatch();
        hackathon.deleteAllInBatch();
        team.deleteAllInBatch();
        utenti.deleteAllInBatch();
        entityManager.clear();
    }
}
