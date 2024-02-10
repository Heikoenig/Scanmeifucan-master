import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailDialogComponent } from './contact-detail-dialog.component';

describe('ContactDetailDialogComponent', () => {
  let component: ContactDetailDialogComponent;
  let fixture: ComponentFixture<ContactDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});