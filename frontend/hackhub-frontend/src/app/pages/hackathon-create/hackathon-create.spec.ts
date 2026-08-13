import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackathonCreate } from './hackathon-create';

describe('HackathonCreate', () => {
  let component: HackathonCreate;
  let fixture: ComponentFixture<HackathonCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackathonCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(HackathonCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
