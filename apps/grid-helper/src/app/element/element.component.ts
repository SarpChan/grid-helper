import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'grid-helper-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent {

  @Input() public id = '';
}
