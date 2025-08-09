import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilePicker } from './file-picker/file-picker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FilePicker],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
