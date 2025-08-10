import { Injectable } from '@angular/core';
import { read, WorkBook, writeFile } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  async readFile(file: File): Promise<WorkBook> {
    const buffer = await file.arrayBuffer();

    return read(buffer, { type: 'buffer' });
  }

  saveFile(workBook: WorkBook, fileName: string): unknown {
    const extIdx = fileName.lastIndexOf('.');
    const updatedFileName = `${fileName.slice(0, extIdx)}_updated${fileName.slice(extIdx)}`;

    return writeFile(workBook, updatedFileName);
  }
}
