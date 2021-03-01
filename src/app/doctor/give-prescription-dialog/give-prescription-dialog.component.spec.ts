import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivePrescriptionDialogComponent } from './give-prescription-dialog.component';

describe('GivePrescriptionDialogComponent', () => {
  let component: GivePrescriptionDialogComponent;
  let fixture: ComponentFixture<GivePrescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivePrescriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivePrescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
