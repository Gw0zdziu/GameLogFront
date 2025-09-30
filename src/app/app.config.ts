import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth/auth.interceptor';
import {refreshTokenInterceptor} from './core/interceptors/refresh-token/refresh-token.interceptor';
import {definePreset} from '@primeng/themes';

const Preset = definePreset(Aura, {
  components: {
    menu: {
      colorScheme: {
        light:{
          root: {
            background: 'var(--gray-light)',
            borderColor: 'var(--gray-light)',
          },
          item: {
            color: 'var(--black-raw)',
            focusColor: '{violet.500}',
            focusBackground: 'var(--gray-light)',
            icon: {
              focusColor: '{violet.500}',
              color: 'var(--black-raw)',
            }
          }
        },
        dark:{
          root: {
            background: 'var(--gray-light)',
            borderColor: 'var(--gray-light)',
          },
          item: {
            color: 'var(--black-raw)',
            focusColor: '{violet.500}',
            icon: {
              focusColor: '{violet.500}',
              color: 'var(--black-raw)',
            }
          }
        }
      }
    }
  },
  semantic: {
    primary: {
      0: '#fff',
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}'
    }
  }
})

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, refreshTokenInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: {
          darkModeSelector: 'dark-theme',
/*
          ripple: true,
*/
        }
      }
    })
  ]
};
