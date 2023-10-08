import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridContainerComponent } from '../grid-container/grid-container.component';

@Component({
    selector: 'grid-helper-tab',
    standalone: true,
    imports: [CommonModule, GridContainerComponent],
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent {
    @Output()
    public css_output: EventEmitter<string> = new EventEmitter<string>();
}
