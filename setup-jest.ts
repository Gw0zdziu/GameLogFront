import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone';
import '@angular/localize/init';

setupZoneTestEnv();

jest.mock('./src/environments/environment', () => ({
  environment: {
    production: false,
    apiUrl: 'https://localhost:8080/api',
  }
}));
