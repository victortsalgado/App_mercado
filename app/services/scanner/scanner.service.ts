import { ImageAsset } from '@nativescript/core';
import { takePicture } from '@nativescript/camera';
import { OcrService } from '../ocr/ocr.service';
import { ReceiptParserService } from '../parser/receipt-parser.service';
import { Receipt } from '../../models/receipt.model';

export class ScannerService {
  private static instance: ScannerService;
  private ocrService: OcrService;
  private parserService: ReceiptParserService;

  private constructor() {
    this.ocrService = OcrService.getInstance();
    this.parserService = ReceiptParserService.getInstance();
  }

  static getInstance(): ScannerService {
    if (!ScannerService.instance) {
      ScannerService.instance = new ScannerService();
    }
    return ScannerService.instance;
  }

  async captureAndProcess(): Promise<Receipt | null> {
    const imageAsset = await this.captureImage();
    if (!imageAsset) return null;

    const text = await this.ocrService.processImage(imageAsset);
    const parsedReceipt = await this.parserService.parseReceipt(text);

    return {
      ...parsedReceipt,
      imageUrl: imageAsset.android || imageAsset.ios,
      id: new Date().getTime().toString(),
      userId: 'user123' // TODO: Get from AuthService
    };
  }

  private async captureImage(): Promise<ImageAsset | null> {
    try {
      return await takePicture({
        width: 1280,
        height: 1920,
        keepAspectRatio: true,
        saveToGallery: false
      });
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      return null;
    }
  }
}