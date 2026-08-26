import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { Observable, Subject } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryAddComponent } from './components/category-add/category-add.component';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({ selector: 'app-category-list', template: '', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })
class MockCategoryListComponent {}

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let dialogServiceMock: jest.Mocked<Pick<DialogService, 'open'>>;
  const refDialogMockSubject = new Subject<unknown>();
  let refDialogMock: { onClose: Observable<unknown> };

  beforeEach(async () => {
    refDialogMock = { onClose: refDialogMockSubject.asObservable() };
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(refDialogMock),
    } as unknown as jest.Mocked<Pick<DialogService, 'open'>>;

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
    })
      .overrideComponent(CategoryComponent, {
        set: {
          imports: [ButtonDirective, ButtonLabel, MockCategoryListComponent],
          providers: [
            { provide: DialogService, useValue: dialogServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openAddCategoryDialog()', () => {
    beforeEach(() => {
      component.openAddCategoryDialog();
    });

    it('should call open method once', () => {
      expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);
    });

    it('should call open method with valid configuration', () => {
      const config: DynamicDialogConfig = {
        header: 'Nowa kategoria',
        modal: true,
        dismissableMask: true,
        closable: true,
        focusOnShow: false,
      };
      expect(dialogServiceMock.open).toHaveBeenCalledWith(CategoryAddComponent, config);
    });

    it('should receive null from onClose', () => {
      refDialogMockSubject.next(null);
      refDialogMock.onClose.subscribe((value) => {
        expect(value).toBeNull();
      });
    });
  });
});
