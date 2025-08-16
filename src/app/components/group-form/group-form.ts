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
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

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
    ConfirmDialog,
    Toast,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './group-form.html',
})
export class GroupForm implements OnInit {
  sheetNames = signal<string[]>([]);
  tableHeaderOptions = signal<SelectOption[]>([]);
  selectedColumnId = signal<string>('');

  workBook!: WorkBook;
  sheetName!: string;
  tableHeadersMap = new Map<string, string | number>();
  view!: SheetJsonViewWithAHeader[];
  selectedRow?: SheetJsonViewWithAHeader;

  private readonly excelService = inject(ExcelService);
  private readonly appService = inject(AppService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    void this.parseFile();
  }

  async parseFile(): Promise<void> {
    this.workBook = await this.excelService.readFile(
      this.appService.selectedFile()!,
    );

    this.sheetNames.set(this.workBook.SheetNames);
  }

  saveFile(event: Event): void {
    this.confirmationService.confirm({
      target: event.target!,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.workBook.Sheets[this.sheetName] = utils.json_to_sheet(this.view);

        this.excelService.saveFile(
          this.workBook,
          this.appService.selectedFile()!.name,
        );
      },
    });
  }

  selectSheet(
    event: SelectButtonChangeTypedEvent,
    tableHeaderSelect: Select,
    tableRowSelect: Select,
  ): void {
    const sheetName = event.value;

    if (!sheetName) {
      return;
    }

    const parsedView = utils.sheet_to_json<SheetJsonViewWithAHeader>(
      this.workBook.Sheets[sheetName],
      {
        header: 'A',
      },
    );
    const headersMap = new Map<string, string | number>();
    const headers = Object.entries(parsedView[0]).map(([key, value]) => {
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

    this.sheetName = sheetName;
    this.tableHeaderOptions.set(headers);
    this.tableHeadersMap = headersMap;
    this.view = parsedView;
  }

  groupView(event: SelectChangeTypedEvent): void {
    const columnId = event.value; // field key A, B, C, etc. in view object

    if (!columnId) {
      return;
    }

    this.selectedColumnId.set(columnId);
  }

  selectRow(event: SelectChangeTypedEvent<SheetJsonViewWithAHeader>): void {
    const rowValue = event.value;

    if (!rowValue) {
      return;
    }

    const selectedRow = this.view.find(
      (row) => row.__rowNum__ === rowValue.__rowNum__,
    );

    if (selectedRow) {
      this.selectedRow = selectedRow;
    }
  }

  addNewRow(tableRowSelect: Select): void {
    const newRow: SheetJsonViewWithAHeader = {
      [this.selectedColumnId()]: 'Empty',
      __rowNum__: this.view.length,
    };

    this.view.push(newRow);
    this.selectedRow = newRow;
    tableRowSelect.updateModel(newRow);
  }

  async copyRowToClipboard(): Promise<void> {
    const row = this.tableHeaderOptions()
      .map((header) => {
        const value = this.selectedRow![header.value];

        if (typeof value === 'string') {
          return value.replace(/(\r\n|\n|\r)/gm, '');
        }

        return value;
      })
      .join('\t');

    await navigator.clipboard.writeText(row);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Selected row has been copied',
    });
  }
}
