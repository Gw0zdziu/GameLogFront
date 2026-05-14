import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  const messageServiceMock = { add: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('showSuccess()', () => {
    it('calls MessageService.add with severity "success"', () => {
      service.showSuccess('Operation completed');

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Sukces',
        detail: 'Operation completed',
      });
    });

    it('passes the message as detail', () => {
      service.showSuccess('Game saved');

      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ detail: 'Game saved' })
      );
    });

    it('calls MessageService.add exactly once', () => {
      service.showSuccess('Done');

      expect(messageServiceMock.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('showError()', () => {
    it('calls MessageService.add with severity "error"', () => {
      service.showError('Something went wrong');

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Something went wrong',
      });
    });

    it('passes the message as detail', () => {
      service.showError('Invalid credentials');

      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ detail: 'Invalid credentials' })
      );
    });

    it('calls MessageService.add exactly once', () => {
      service.showError('Error');

      expect(messageServiceMock.add).toHaveBeenCalledTimes(1);
    });
  });
});
