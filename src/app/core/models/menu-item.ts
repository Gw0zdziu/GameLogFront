import {IconDefinition} from '@fortawesome/angular-fontawesome';

export interface MenuItem {
  label: string;
  icon: IconDefinition;
  routerLink: string;
}
