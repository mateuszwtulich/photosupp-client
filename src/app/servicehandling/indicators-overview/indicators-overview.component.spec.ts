import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsOverviewComponent } from './indicators-overview.component';

describe('IndicatorsOverviewComponent', () => {
  let component: IndicatorsOverviewComponent;
  let fixture: ComponentFixture<IndicatorsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
