import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilePicker } from './file-picker';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('FilePicker', () => {
  let component: FilePicker;
  let fixture: ComponentFixture<FilePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePicker],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilePicker);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('acceptedTypes', 'xlsx');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
