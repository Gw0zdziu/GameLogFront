import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoveryUpdatePasswordComponent} from './recovery-update-password.component';

describe('RecoveryUpdatePasswordComponent', () => {
  let component: RecoveryUpdatePasswordComponent;
  let fixture: ComponentFixture<RecoveryUpdatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryUpdatePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryUpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
