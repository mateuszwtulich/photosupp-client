import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRoleComponent } from './modify-role.component';

describe('ModifyRoleComponent', () => {
  let component: ModifyRoleComponent;
  let fixture: ComponentFixture<ModifyRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
