import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyIndicatorComponent } from './modify-indicator.component';

describe('ModifyIndicatorComponent', () => {
  let component: ModifyIndicatorComponent;
  let fixture: ComponentFixture<ModifyIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
