import { Injectable } from '@angular/core';
import { read, WorkBook } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  async readFile(file: File): Promise<WorkBook> {
    const buffer = await file.arrayBuffer();

    return read(buffer, { type: 'buffer' });
  }
}
