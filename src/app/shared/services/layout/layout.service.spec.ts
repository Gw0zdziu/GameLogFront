import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('isMenuOpen$ is false by default', () => {
    expect(service.isMenuOpen$()).toBe(false);
  });

  describe('setStateMenu()', () => {
    it('sets menu open to true', () => {
      service.setStateMenu(true);
      expect(service.isMenuOpen$()).toBe(true);
    });

    it('sets menu open to false', () => {
      service.setStateMenu(true);
      service.setStateMenu(false);
      expect(service.isMenuOpen$()).toBe(false);
    });
  });

  describe('toggleMenu()', () => {
    it('toggles from false to true', () => {
      service.toggleMenu();
      expect(service.isMenuOpen$()).toBe(true);
    });

    it('toggles from true to false', () => {
      service.setStateMenu(true);
      service.toggleMenu();
      expect(service.isMenuOpen$()).toBe(false);
    });

    it('toggles back to original state after two calls', () => {
      service.toggleMenu();
      service.toggleMenu();
      expect(service.isMenuOpen$()).toBe(false);
    });
  });
});
