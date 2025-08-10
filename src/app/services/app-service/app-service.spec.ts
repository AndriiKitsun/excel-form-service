import { TestBed } from '@angular/core/testing';
import { AppService } from './app-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
