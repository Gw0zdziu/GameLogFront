import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';
import {messages} from '../../../core/constants/messages';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);


  showSuccess(errorCode: string): void{
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: this.getDetails(errorCode)});
  }

  showError(errorCode: string): void{
    this.messageService.add({severity: 'error', summary: 'Błąd', detail: this.getDetails(errorCode)});
  }

  showInfo(errorCode: string): void{
    this.messageService.add({severity: 'info', summary: 'Informacja', detail: this.getDetails(errorCode)});
  }

  private getDetails(key: string): string{
    if (messages.has(key)){
      return  messages.get(key) as string;
    } else {
      return messages.get('unhanding-message') as string;
    }
  }
}
