import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HakathonCard } from './hakathon-card';

describe('HakathonCard', () => {
  let component: HakathonCard;
  let fixture: ComponentFixture<HakathonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HakathonCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HakathonCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
