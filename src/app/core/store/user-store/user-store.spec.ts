import {TestBed} from '@angular/core/testing';
import {UserStore} from './user-store';
import {UserService} from '../../../features/user/services/user.service';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

const mockUser: GetUserDto = {
  userId: 'user-1',
  userName: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  userEmail: 'john@example.com',
  isActive: true,
};

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;

  const userServiceMock = {
    getUser: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        UserStore,
        {provide: UserService, useValue: userServiceMock},
      ],
    });
    store = TestBed.inject(UserStore);
  });

  describe('initial state', () => {
    it('user is null when localStorage has no stored user', () => {
      expect(store.user()).toBeNull();
    });

    it('userId is undefined when user is null', () => {
      expect(store.userId()).toBeUndefined();
    });
  });

  describe('userId (computed)', () => {
    it('returns the userId from the current user', () => {
      userServiceMock.getUser.mockReturnValue(of(mockUser));

      store.getUser();

      expect(store.userId()).toBe('user-1');
    });
  });

  describe('cleanStore()', () => {
    it('resets user to null', () => {
      userServiceMock.getUser.mockReturnValue(of(mockUser));
      store.getUser();
      expect(store.user()).toEqual(mockUser);

      store.cleanStore();

      expect(store.user()).toBeNull();
    });

    it('resets userId to undefined', () => {
      userServiceMock.getUser.mockReturnValue(of(mockUser));
      store.getUser();

      store.cleanStore();

      expect(store.userId()).toBeUndefined();
    });
  });

  describe('getUser()', () => {
    it('patches user state with the service response', () => {
      userServiceMock.getUser.mockReturnValue(of(mockUser));

      store.getUser();

      expect(store.user()).toEqual(mockUser);
    });

    it('calls UserService.getUser()', () => {
      userServiceMock.getUser.mockReturnValue(of(mockUser));

      store.getUser();

      expect(userServiceMock.getUser).toHaveBeenCalledTimes(1);
    });

    it('logs the error and leaves user unchanged on HTTP failure', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      userServiceMock.getUser.mockReturnValue(
        throwError(() => new HttpErrorResponse({status: 500}))
      );

      store.getUser();

      expect(consoleSpy).toHaveBeenCalled();
      expect(store.user()).toBeNull();
      consoleSpy.mockRestore();
    });
  });
});
