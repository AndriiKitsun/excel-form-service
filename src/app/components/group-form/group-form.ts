import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app-service/app-service';
import { ExcelService } from '../../services/excel-service/excel-service';
import {
  SelectChangeTypedEvent,
  SelectOption,
} from '../../types/primeng/select.types';
import { utils, WorkBook } from 'xlsx';
import { SheetJsonViewWithAHeader } from '../../types/xlsx.types';
import { SelectButtonChangeTypedEvent } from '../../types/primeng/select-button.types';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Select } from 'primeng/select';
import { KeyValuePipe, NgClass } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-group-form',
  imports: [
    FormsModule,
    Button,
    SelectButton,
    Select,
    KeyValuePipe,
    FloatLabel,
    Textarea,
    NgClass,
  ],
  templateUrl: './group-form.html',
})
export class GroupForm implements OnInit {
  sheetNames = signal<string[]>([]);
  tableHeaderOptions = signal<SelectOption[]>([]);
  selectedColumnId = signal<string>('');
  tableRowOptions = signal<(string | number)[]>([]);

  workBook!: WorkBook;
  tableHeadersMap = new Map<string, string | number>();
  view!: SheetJsonViewWithAHeader[];
  selectedRow?: SheetJsonViewWithAHeader;

  selectedRowS = signal<SheetJsonViewWithAHeader>({ __rowNum__: 0 });

  private readonly excelService = inject(ExcelService);
  private readonly appService = inject(AppService);

  ngOnInit(): void {
    void this.parseFile();
  }

  async parseFile(): Promise<void> {
    this.workBook = await this.excelService.readFile(
      this.appService.selectedFile()!,
    );

    this.sheetNames.set(this.workBook.SheetNames);
  }

  selectSheet(
    event: SelectButtonChangeTypedEvent,
    tableHeaderSelect: Select,
    tableRowSelect: Select,
  ): void {
    if (!event.value) {
      return;
    }

    const parsedView = utils.sheet_to_json<SheetJsonViewWithAHeader>(
      this.workBook.Sheets[event.value],
      {
        header: 'A',
      },
    );
    const headersMap = new Map<string, string | number>();
    const headers = Object.entries(parsedView.shift()!).map(([key, value]) => {
      headersMap.set(key, value);

      return {
        label: value as string,
        value: key,
      } satisfies SelectOption;
    });

    // Clear header select and grouping by column Id
    this.selectedColumnId.set('');
    tableHeaderSelect.clear();

    // Clear rows
    tableRowSelect.clear();
    this.selectedRow = undefined;

    this.tableHeaderOptions.set(headers);
    this.tableHeadersMap = headersMap;
    this.view = parsedView;
  }

  groupView(event: SelectChangeTypedEvent): void {
    const columnId = event.value; // field key A, B, C, etc. in view object

    if (!columnId) {
      return;
    }

    const groupedValues = this.view.map((row) => row[columnId]).filter(Boolean);

    this.selectedColumnId.set(columnId);
    this.tableRowOptions.set(groupedValues);
  }

  selectRow(event: SelectChangeTypedEvent<string | number>): void {
    const rowValue = event.value;

    if (!rowValue) {
      return;
    }

    const selectedRow = this.view.find(
      (row) => row[this.selectedColumnId()] === rowValue,
    );

    if (selectedRow) {
      this.selectedRow = selectedRow;
      this.selectedRowS.set(selectedRow);
    }
  }
}
