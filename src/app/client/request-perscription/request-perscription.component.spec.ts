import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPerscriptionComponent } from './request-perscription.component';

describe('RequestPerscriptionComponent', () => {
  let component: RequestPerscriptionComponent;
  let fixture: ComponentFixture<RequestPerscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPerscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPerscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
