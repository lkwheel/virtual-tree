import { Component, OnInit, Input, EventEmitter,
  Output, ChangeDetectionStrategy } from '@angular/core';
import { TristateSelection } from './tristate.enum';

@Component({
  selector: 'tristate-checkbox',
  templateUrl: './tristate-checkbox.component.html',
  styleUrls: ['./tristate-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TristateCheckboxComponent implements OnInit {
  TristateSelection = TristateSelection;

  @Input()
  value: TristateSelection;

  @Input()
  disabled: boolean;

  @Output()
  click = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onClick(event) {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this.click.next(event);
    }
  }
}
