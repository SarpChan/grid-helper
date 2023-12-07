import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Units } from '../../../../../libs/fields/src/models/units';

@Component({
  selector: 'grid-helper-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() public form!: FormGroup;
  @Input() public form_name = '';
  @Input() public style_property = '';
  @Input() public style_value = '';
  @Input() public label = '';
  @Input() public background_label = '';
  @Input() public min_value: number | undefined = 0;
  @Input() public orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() public removable = false;
  @Input() public default_unit: Units = Units.FR;
  @Input() public placeholder?: string;

  @Output() public remove = new EventEmitter<void>();

  public units = Object.values(Units);
}
