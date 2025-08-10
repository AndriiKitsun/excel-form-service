import { SelectChangeEvent } from 'primeng/select';

export interface SelectChangeTypedEvent<T = string> extends SelectChangeEvent {
  value: T;
}

export interface SelectOption {
  label: string;
  value: string;
}
