import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);


  showSuccess(message: string): void{
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: message});
  }

  showError(message: string): void{
    this.messageService.add({severity: 'error', summary: 'Błąd', detail: message});
  }
}
