import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Account } from './account';

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne({
      method: 'GET',
      url: '/api/team/mio',
    }).flush({
      nomeTeam: 'Team Test',
      nomeLeader: 'leader',
      nomiMembri: ['leader'],
    });
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create and load the team', () => {
    expect(component).toBeTruthy();
    expect(component.nomeTeam()).toBe('Team Test');
    expect(component.caricamentoTeam()).toBe(false);
  });
});
