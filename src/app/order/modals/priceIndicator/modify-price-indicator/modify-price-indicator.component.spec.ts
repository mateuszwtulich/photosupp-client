import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPriceIndicatorComponent } from './modify-price-indicator.component';

describe('ModifyPriceIndicatorComponent', () => {
  let component: ModifyPriceIndicatorComponent;
  let fixture: ComponentFixture<ModifyPriceIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPriceIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPriceIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
