import { Observable, ImageAsset } from '@nativescript/core';
import { takePicture } from '@nativescript/camera';
import { OcrService } from '../../services/ocr.service';
import { ReceiptParserService } from '../../services/receipt-parser.service';
import { ReceiptStorageService } from '../../services/receipt-storage.service';
import { Frame } from '@nativescript/core';

export class CameraViewModel extends Observable {
  private ocrService: OcrService;
  private storageService: ReceiptStorageService;

  constructor() {
    super();
    this.ocrService = OcrService.getInstance();
    this.storageService = ReceiptStorageService.getInstance();
  }

  async onCapture() {
    try {
      const options = {
        width: 1280,
        height: 1920,
        keepAspectRatio: true,
        saveToGallery: false
      };

      const imageAsset = await takePicture(options);
      if (imageAsset) {
        await this.processReceipt(imageAsset);
      }
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
    }
  }

  private async processReceipt(imageAsset: ImageAsset) {
    try {
      // Processa a imagem com OCR
      const text = await this.ocrService.processImage(imageAsset);
      
      // Extrai as informações da nota
      const parsedReceipt = ReceiptParserService.parseText(text);
      
      // Salva a nota processada
      await this.storageService.saveReceipt({
        id: new Date().getTime().toString(),
        ...parsedReceipt,
        imageUrl: imageAsset.android || imageAsset.ios,
        userId: 'user123' // TODO: Implementar autenticação
      });

      // Volta para a tela inicial
      Frame.topmost().goBack();
    } catch (error) {
      console.error('Erro ao processar nota fiscal:', error);
    }
  }
}