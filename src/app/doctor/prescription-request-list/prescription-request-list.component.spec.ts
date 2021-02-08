import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionRequestListComponent } from './prescription-request-list.component';

describe('PrescriptionRequestListComponent', () => {
  let component: PrescriptionRequestListComponent;
  let fixture: ComponentFixture<PrescriptionRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
