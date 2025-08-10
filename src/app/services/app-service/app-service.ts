import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private file = signal<File | null>(null);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  selectedFile = this.file.asReadonly();

  setFile(file: File | null): void {
    this.file.set(file);
  }
}
