import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HackathonDetail } from './hackathon-detail';
import { Hackathon } from '../../models/hackathon.model';

describe('HackathonDetail', () => {
  let component: HackathonDetail;
  let fixture: ComponentFixture<HackathonDetail>;
  const hackathon: Hackathon = {
    id: 'test-id',
    nome: 'Hackathon Test',
    luogo: 'Camerino',
    premio: 1000,
    dataInizio: '2026-09-01',
    dataFine: '2026-09-02',
    teamMin: 3,
    teamMax: 5,
    maxIscrizioni: 10,
    numeroTeamIscritti: 0,
    regolamento: 'Regolamento test',
    scadenzaIscrizioni: '2026-08-31T23:59',
    nomeOrganizzatore: 'organizzatore',
    nomeGiudice: 'giudice',
    nomeMentori: ['mentore'],
    stato: 'ISCRIZIONI_APERTE',
    postiRimanenti: 10,
  };

  beforeEach(async () => {
    localStorage.removeItem('nomeUtente');
    await TestBed.configureTestingModule({
      imports: [HackathonDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'test-id'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HackathonDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne({
      method: 'GET',
      url: '/api/hackathon/test-id',
    }).flush(hackathon);
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create and load hackathon details for a visitor', () => {
    expect(component).toBeTruthy();
    expect(component.hackathon()).toEqual(hackathon);
    expect(component.erroreCaricamento()).toBe('');
  });
});
