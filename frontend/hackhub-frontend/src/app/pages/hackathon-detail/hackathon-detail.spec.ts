import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { HackathonDetail } from './hackathon-detail';

describe('HackathonDetail', () => {
  let component: HackathonDetail;
  let fixture: ComponentFixture<HackathonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackathonDetail],
      providers: [
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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
