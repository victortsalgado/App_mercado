import { Observable } from '@nativescript/core';
import { ScannerService } from '../../services/scanner/scanner.service';
import { Frame } from '@nativescript/core';

export class ScannerViewModel extends Observable {
  private scannerService: ScannerService;
  private _status: string = '';

  constructor() {
    super();
    this.scannerService = ScannerService.getInstance();
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    if (this._status !== value) {
      this._status = value;
      this.notifyPropertyChange('status', value);
    }
  }

  async captureReceipt() {
    try {
      this.status = 'Processando imagem...';
      const receipt = await this.scannerService.captureAndProcess();
      
      if (receipt) {
        Frame.topmost().navigate({
          moduleName: 'components/receipt/receipt-details',
          context: { receipt }
        });
      }
    } catch (error) {
      console.error('Erro ao capturar nota:', error);
      this.status = 'Erro ao processar imagem. Tente novamente.';
    }
  }
}