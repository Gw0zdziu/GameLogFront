import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

jest.mock('./src/environments/environment', () => ({
  environment: {
    production: false,
    apiUrl: 'https://localhost:8080/api',
  }
}));
