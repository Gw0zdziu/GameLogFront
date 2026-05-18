import {CloseSidebarDirective} from './close-sidebar.directive';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {LayoutService} from '../../shared/services/layout/layout.service';
import Mocked = jest.Mocked;

@Component({
  template: '<button type="button" appCloseSidebar>close</button>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CloseSidebarDirective],
})
class TestHostComponent {}

describe('CloseSidebarDirective', () => {
  let layoutServiceMock: Mocked<Partial<LayoutService>>;

  beforeEach(() => {
    layoutServiceMock = {
      setStateMenu: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {provide: LayoutService, useValue: layoutServiceMock},
      ],
    });
  });

  it('should create an instance', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new CloseSidebarDirective();
      expect(directive).toBeTruthy();
    });
  });

  it('should call setStateMenu(false) when onClick is invoked directly', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new CloseSidebarDirective();
      directive.onClick();
      expect(layoutServiceMock.setStateMenu).toHaveBeenCalledWith(false);
    });
  });

  it('should call setStateMenu(false) once when the host element is clicked', () => {
    const fixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.directive(CloseSidebarDirective));
    button.triggerEventHandler('click', null);
    expect(layoutServiceMock.setStateMenu).toHaveBeenCalledTimes(1);
    expect(layoutServiceMock.setStateMenu).toHaveBeenCalledWith(false);
  });
});