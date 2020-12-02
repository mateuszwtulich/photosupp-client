import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsPlanningComponent } from './bookings-planning.component';

describe('BookingsPlanningComponent', () => {
  let component: BookingsPlanningComponent;
  let fixture: ComponentFixture<BookingsPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
