import { ImageAsset } from '@nativescript/core';
import { createWorker } from 'tesseract.js';

export class OcrService {
  private static instance: OcrService;
  private worker: any;

  private constructor() {
    this.initWorker();
  }

  static getInstance(): OcrService {
    if (!OcrService.instance) {
      OcrService.instance = new OcrService();
    }
    return OcrService.instance;
  }

  private async initWorker() {
    this.worker = await createWorker('por');
  }

  async processImage(imageAsset: ImageAsset): Promise<string> {
    try {
      const { data: { text } } = await this.worker.recognize(imageAsset);
      return text;
    } catch (error) {
      console.error('Erro no OCR:', error);
      throw error;
    }
  }
}