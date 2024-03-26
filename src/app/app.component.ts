import { Component, Renderer2 } from '@angular/core';

import { RowComponent } from './components/row/row.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  rows = [
    {
      isSelected: false,
      showChild: false,
      showActions: false,
    },
    {
      isSelected: false,
      showChild: false,
      showActions: false,
    },
    {
      isSelected: false,
      showChild: false,
      showActions: false,
    },
  ];

  constructor(private renderer: Renderer2) {
    this.renderer.listen(
      'window',
      'click',
      this.closeActionsWhenClickOutside.bind(this),
    );
  }

  closeActionsWhenClickOutside(e: Event) {
    const target = e.target as HTMLElement;
    const targetIndexAttr = target.getAttribute('data-row-index');
    const targetIndexAttrNumber = targetIndexAttr
      ? parseInt(targetIndexAttr)
      : -1;
    const rowIndexWithActionsOpened = this.rows.findIndex(
      (row, index) => row.showActions && index !== targetIndexAttrNumber,
    );
    const shouldCloseRowsWithActionsOpened =
      rowIndexWithActionsOpened >= 0 &&
      targetIndexAttrNumber !== rowIndexWithActionsOpened;

    if (shouldCloseRowsWithActionsOpened) {
      this.rows[rowIndexWithActionsOpened].showActions = false;
    }
  }

  toggleShowChild(rowIndex: number) {
    this.rows[rowIndex].showChild = !this.rows[rowIndex].showChild;
  }

  toggleIsSelected(rowIndex: number) {
    this.rows[rowIndex].isSelected = !this.rows[rowIndex].isSelected;
  }

  toggleShowDropdown(rowIndex: number) {
    this.rows[rowIndex].showActions = !this.rows[rowIndex].showActions;
  }
}
