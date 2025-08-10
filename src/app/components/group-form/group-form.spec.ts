import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupForm } from './group-form';
import { provideZonelessChangeDetection } from '@angular/core';
import { ExcelService } from '../../services/excel-service/excel-service';
import { WorkBook } from 'xlsx';

describe('GroupForm', () => {
  let component: GroupForm;
  let fixture: ComponentFixture<GroupForm>;

  const workBookMock: WorkBook = {
    Sheets: {},
    SheetNames: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupForm],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ExcelService,
          useValue: {
            readFile: () => workBookMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
