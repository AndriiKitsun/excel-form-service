import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilePicker } from './components/file-picker/file-picker';
import { GroupForm } from './components/group-form/group-form';
import { AppService } from './services/app-service/app-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FilePicker, GroupForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  appService = inject(AppService);
}
