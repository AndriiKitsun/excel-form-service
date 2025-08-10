import { TestBed } from '@angular/core/testing';
import { ExcelService } from './excel-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(ExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
