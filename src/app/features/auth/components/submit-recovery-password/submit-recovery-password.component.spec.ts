import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRecoveryPasswordComponent } from './submit-recovery-password.component';

describe('SubmitRecoveryPasswordComponent', () => {
  let component: SubmitRecoveryPasswordComponent;
  let fixture: ComponentFixture<SubmitRecoveryPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitRecoveryPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitRecoveryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
