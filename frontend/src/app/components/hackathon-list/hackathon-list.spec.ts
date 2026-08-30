import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HackathonList } from './hackathon-list';

describe('HackathonList', () => {
  let component: HackathonList;
  let fixture: ComponentFixture<HackathonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackathonList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HackathonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne({
      method: 'GET',
      url: '/api/hackathon',
    }).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create and load the hackathon list', () => {
    expect(component).toBeTruthy();
    expect(component.hackathons()).toEqual([]);
  });
});
