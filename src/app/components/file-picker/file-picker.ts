import { Component, inject, input } from '@angular/core';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { AppService } from '../../services/app-service/app-service';

@Component({
  selector: 'app-file-picker',
  imports: [FileUpload, Button],
  templateUrl: './file-picker.html',
})
export class FilePicker {
  appService = inject(AppService);

  acceptedTypes = input.required<string>();

  clearFile(fileUploader: FileUpload): void {
    fileUploader.clear();

    this.appService.selectedFile.set(null);
  }

  uploadFile(fileUploader: FileUpload): void {
    if (!fileUploader.hasFiles()) {
      return;
    }

    fileUploader.upload();
  }

  emitFile(event: FileUploadHandlerEvent): void {
    this.appService.selectedFile.set(event.files[0]);
  }
}
