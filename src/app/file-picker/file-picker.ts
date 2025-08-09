import { Component, output } from '@angular/core';
import { FileBeforeUploadEvent, FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-file-picker',
  imports: [FileUpload, Button],
  templateUrl: './file-picker.html',
})
export class FilePicker {
  file = output<FormData>();

  onBeforeUpload(file: FileBeforeUploadEvent): void {
    this.file.emit(file.formData);
  }
}
