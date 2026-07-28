import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonList } from './hackathon-list';

describe('HackathonList', () => {
  let component: HackathonList;
  let fixture: ComponentFixture<HackathonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackathonList],
    }).compileComponents();

    fixture = TestBed.createComponent(HackathonList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
