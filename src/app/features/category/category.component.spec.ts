import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { signal } from '@angular/core';
import { CategoryStore } from './store/category-store';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryAddComponent } from './components/category-add/category-add.component';
import {FormatDatePipe} from '../../core/pipes/format-date.pipe';


describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let confirmationServiceMock: jest.Mocked<Partial<ConfirmationService>>;
  let dialogServiceMock: DialogService;
  let formatDateDistancePipeMock: jest.Mocked<Partial<FormatDatePipe>>;
  const refDialogMockSubject = new Subject<any>();
  let refDialogMock: { onClose: Observable<any> };
  const categoryStoreMock = {
    categories$: signal([]),
    isLoading: signal(false),
    getCategories: jest.fn(),
  };

  beforeEach(async () => {
    refDialogMock = {
      onClose: refDialogMockSubject.asObservable(),
    };
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(refDialogMock),
    } as unknown as DialogService;

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: FormatDatePipe, useValue: formatDateDistancePipeMock },
        { provide: CategoryStore, useValue: categoryStoreMock },
      ],
    }).overrideComponent(CategoryComponent, {
      set: {
        providers: [
          { provide: DialogService, useValue: dialogServiceMock },
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openAddCategoryDialog()', () =>{

    it('should called open method 1 times', () => {
      //ARRANGE
      const config = {
        header: 'Nowa kategoria',
        modal: true,
      };
      //ACT
      component.openAddCategoryDialog();

      //ASSERT
      expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);
      expect(dialogServiceMock.open).toHaveBeenCalledWith(CategoryAddComponent, config);
    });

    it('should return null from onClose', () => {
      refDialogMockSubject.next(null);
      refDialogMock.onClose.subscribe((value: boolean) => {
        expect(value).toBeNull();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
})
