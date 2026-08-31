package unicam.cs.hackhub.servizi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import unicam.cs.hackhub.boundary.dto.HackathonRequest;
import unicam.cs.hackhub.domain.RuoloStaff;
import unicam.cs.hackhub.domain.RuoloTeam;
import unicam.cs.hackhub.domain.StatoRichiesta;
import unicam.cs.hackhub.domain.implementazione.Hackathon;
import unicam.cs.hackhub.domain.implementazione.InvitoStaff;
import unicam.cs.hackhub.domain.implementazione.MembroTeam;
import unicam.cs.hackhub.domain.implementazione.Team;
import unicam.cs.hackhub.domain.implementazione.Utente;
import unicam.cs.hackhub.handler.CreaHackathonHandler;
import unicam.cs.hackhub.handler.CreaTeamHandler;
import unicam.cs.hackhub.handler.GestisciRichiesteHandler;
import unicam.cs.hackhub.repository.RepositoryHackathon;
import unicam.cs.hackhub.repository.RepositoryMembriTeam;
import unicam.cs.hackhub.repository.RepositoryRichiesta;
import unicam.cs.hackhub.repository.RepositoryStaff;
import unicam.cs.hackhub.repository.RepositoryTeam;
import unicam.cs.hackhub.repository.RepositoryUtente;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Dati esclusivamente locali/demo. Gli aggregati già presenti non vengono modificati:
 * anche password, ruoli, date e relazioni modificati durante una demo sono conservati.
 */
@Component
@ConditionalOnProperty(prefix = "app.demo-data", name = "enabled", havingValue = "true")
public class DemoDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);
    private static final String PASSWORD_DEMO = "Demo123!";
    private static final String NOME_TEAM = "Team Alpha";
    private static final String NOME_HACKATHON = "HackHub Demo";

    private final RepositoryUtente repositoryUtente;
    private final RepositoryTeam repositoryTeam;
    private final RepositoryMembriTeam repositoryMembriTeam;
    private final RepositoryHackathon repositoryHackathon;
    private final RepositoryStaff repositoryStaff;
    private final RepositoryRichiesta repositoryRichiesta;
    private final PasswordEncoder passwordEncoder;
    private final CreaTeamHandler creaTeamHandler;
    private final CreaHackathonHandler creaHackathonHandler;
    private final GestisciRichiesteHandler gestisciRichiesteHandler;

    public DemoDataInitializer(RepositoryUtente repositoryUtente, RepositoryTeam repositoryTeam,
                               RepositoryMembriTeam repositoryMembriTeam, RepositoryHackathon repositoryHackathon,
                               RepositoryStaff repositoryStaff, RepositoryRichiesta repositoryRichiesta,
                               PasswordEncoder passwordEncoder, CreaTeamHandler creaTeamHandler,
                               CreaHackathonHandler creaHackathonHandler,
                               GestisciRichiesteHandler gestisciRichiesteHandler) {
        this.repositoryUtente = repositoryUtente;
        this.repositoryTeam = repositoryTeam;
        this.repositoryMembriTeam = repositoryMembriTeam;
        this.repositoryHackathon = repositoryHackathon;
        this.repositoryStaff = repositoryStaff;
        this.repositoryRichiesta = repositoryRichiesta;
        this.passwordEncoder = passwordEncoder;
        this.creaTeamHandler = creaTeamHandler;
        this.creaHackathonHandler = creaHackathonHandler;
        this.gestisciRichiesteHandler = gestisciRichiesteHandler;
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (String nome : List.of("leader1", "membro1", "membro2", "organizzatore1", "giudice1", "mentore1")) {
            creaUtenteSeAssente(nome);
        }
        creaTeamSeAssente();
        creaHackathonSeAssente();
        log.info("Inizializzazione dati demo terminata; i dati già presenti sono stati conservati.");
    }

    private Utente creaUtenteSeAssente(String nome) {
        return repositoryUtente.findByNomeUtente(nome).orElseGet(() ->
                repositoryUtente.save(new Utente(nome, nome + "@example.com", passwordEncoder.encode(PASSWORD_DEMO))));
    }

    private void creaTeamSeAssente() {
        if (repositoryTeam.existsByNome(NOME_TEAM)) {
            return;
        }
        if (repositoryMembriTeam.findByUtente_NomeUtente("leader1").isPresent()) {
            log.warn("Team demo non creato: leader1 appartiene già a un team.");
            return;
        }

        creaTeamHandler.avviaCreazioneTeam("leader1", NOME_TEAM);
        Team team = repositoryTeam.findByNome(NOME_TEAM).orElseThrow();
        for (String nome : List.of("membro1", "membro2")) {
            Utente utente = repositoryUtente.findByNomeUtente(nome).orElseThrow();
            if (repositoryMembriTeam.existsByUtente(utente)) {
                log.warn("Membro demo non aggiunto: {} appartiene già a un team.", nome);
                continue;
            }
            team.aggiungiMembro(new MembroTeam(utente, team, RuoloTeam.MEMBRO));
        }
        repositoryTeam.save(team);
    }

    private void creaHackathonSeAssente() {
        if (repositoryHackathon.existsByNome(NOME_HACKATHON)) {
            return;
        }

        LocalDate inizio = LocalDate.now().plusDays(30);
        HackathonRequest request = new HackathonRequest(
                NOME_HACKATHON, inizio, inizio.plusDays(2), "Camerino",
                new BigDecimal("1000.00"), 3, 6, 10,
                "Demo locale: team da 3 a 6 membri; consegnare un link al progetto entro la fine dell'evento.",
                inizio.minusDays(7).atTime(23, 59), "giudice1", List.of("mentore1"));

        creaHackathonHandler.avviaCreazioneHackathon(request, "organizzatore1");
        Hackathon hackathon = repositoryHackathon.findByNome(NOME_HACKATHON).orElseThrow();
        accettaInvitoStaff(hackathon, "giudice1", RuoloStaff.GIUDICE);
        accettaInvitoStaff(hackathon, "mentore1", RuoloStaff.MENTORE);
    }

    private void accettaInvitoStaff(Hackathon hackathon, String nome, RuoloStaff ruolo) {
        if (repositoryStaff.findByUtente_NomeUtenteAndHackathonAndRuolo(nome, hackathon, ruolo).isPresent()) {
            return;
        }
        Utente utente = repositoryUtente.findByNomeUtente(nome).orElseThrow();
        InvitoStaff invito = repositoryRichiesta.findAllByDestinatario(utente).stream()
                .filter(InvitoStaff.class::isInstance)
                .map(InvitoStaff.class::cast)
                .filter(i -> i.getHackathon().getIdHackathon().equals(hackathon.getIdHackathon()))
                .filter(i -> i.getRuolo() == ruolo && i.getStato() == StatoRichiesta.INVIATO)
                .findFirst().orElseThrow();
        gestisciRichiesteHandler.accettaRichiesta(nome, invito.getIdRichiesta());
    }
}
