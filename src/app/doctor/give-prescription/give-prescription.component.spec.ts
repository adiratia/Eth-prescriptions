import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivePrescriptionComponent } from './give-prescription.component';

describe('GivePrescriptionComponent', () => {
  let component: GivePrescriptionComponent;
  let fixture: ComponentFixture<GivePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivePrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
