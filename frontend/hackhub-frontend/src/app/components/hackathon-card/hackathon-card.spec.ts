import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HackathonCard } from './hackathon-card';

describe('HackathonCard', () => {
  let component: HackathonCard;
  let fixture: ComponentFixture<HackathonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackathonCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HackathonCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hackathon', {
      id: 'test-id',
      nome: 'Hackathon Test',
      luogo: 'Camerino',
      premio: 1000,
      dataInizio: '2026-09-01',
      dataFine: '2026-09-02',
      teamMin: 3,
      teamMax: 5,
      maxIscrizioni: 10,
      regolamento: 'Regolamento test',
      scadenzaIscrizioni: '2026-08-31T23:59',
      nomeOrganizzatore: 'organizzatore',
      nomeGiudice: 'giudice',
      nomeMentori: ['mentore1'],
      stato: 'ISCRIZIONI_APERTE',
      postiRimanenti: 10
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
