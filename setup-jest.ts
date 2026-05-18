import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone';
import '@angular/localize/init';
import '@testing-library/jest-dom';
setupZoneTestEnv();

jest.mock('./src/environments/environment', () => ({
  environment: {
    production: false,
    apiUrl: 'https://localhost:8080/api',
  }
}));
