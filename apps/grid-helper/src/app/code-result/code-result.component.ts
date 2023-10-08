import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeResults } from '../../../../../libs/fields/src/models/code-results.model';

@Component({
  selector: 'grid-helper-code-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-result.component.html',
  styleUrls: ['./code-result.component.scss'],
})
export class CodeResultComponent {
  @Input() css_text: string = '';
  @Input() html_text: string = '';
  @Input() results: CodeResults[] = [];
  public selectedTab: 'css' | 'html' = 'css';

  copy_to_clipboard(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    navigator.clipboard.writeText(this.selectedTab === 'css' ? this.css_text : this.html_text).then(() => {
      alert('copied to clipboard');
    });
  }
}
