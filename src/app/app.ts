import { Component, inject } from '@angular/core';
import { AppService } from './services/app-service/app-service';
import { GroupForm } from './components/group-form/group-form';
import { RouterOutlet } from '@angular/router';
import { FilePicker } from './components/file-picker/file-picker';

@Component({
  selector: 'app-root',
  imports: [GroupForm, RouterOutlet, FilePicker],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  appService = inject(AppService);
}
