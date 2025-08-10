import { SelectButtonChangeEvent } from 'primeng/selectbutton';

export interface SelectButtonChangeTypedEvent<T = string>
  extends SelectButtonChangeEvent {
  value?: T;
}
