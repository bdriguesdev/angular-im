import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Flip } from 'gsap/Flip';
import { computePosition, autoPlacement, autoUpdate } from '@floating-ui/dom';
import gsap from 'gsap';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css',
})
export class RowComponent implements OnChanges {
  @ViewChild('row') row!: ElementRef<HTMLElement>;
  @ViewChild('rowContent') rowContent!: ElementRef<HTMLElement>;
  @ViewChild('child') child!: ElementRef<HTMLElement>;
  @ViewChild('childContent') childContent!: ElementRef<HTMLElement>;
  @ViewChild('actions') actions!: ElementRef<HTMLElement>;

  @Input() isSelected = false;
  @Input() showChild = false;
  @Input() showActions = false;

  cleanupAutoUpdateDropdownPosition: Function | null = null;

  ngOnChanges(changes: SimpleChanges) {
    const inputs = [
      { name: 'isSelected', callback: this.handleIsSelectedChange.bind(this) },
      { name: 'showChild', callback: this.handleShowChildChange.bind(this) },
      {
        name: 'showActions',
        callback: this.handleShowActionsChange.bind(this),
      },
    ];

    inputs.forEach(({ name, callback }) =>
      this.didInputChanged(changes, name, callback),
    );
  }

  ngAfterViewInit() {
    this.setAutoUpdateForActionsPosition();
  }

  ngOnDestroy() {
    if (this.cleanupAutoUpdateDropdownPosition)
      this.cleanupAutoUpdateDropdownPosition();
  }

  didInputChanged(
    changes: SimpleChanges,
    inputName: string,
    callback: Function,
  ) {
    if (
      !changes[inputName]?.firstChange &&
      changes[inputName]?.currentValue !== changes[inputName]?.previousValue
    ) {
      callback();
    }
  }

  handleIsSelectedChange() {
    const currState = Flip.getState(this.row.nativeElement);

    this.row.nativeElement.classList.toggle('row--selected', this.isSelected);

    Flip.from(currState, { duration: 0.2, ease: 'power1.inOut' });
  }

  handleShowChildChange() {
    const currState = Flip.getState(this.child.nativeElement);
    const child = this.child.nativeElement;
    const childContent = this.childContent.nativeElement;

    if (this.showChild) {
      childContent.style.opacity = '0';
      gsap
        .fromTo(
          child,
          { height: 0 },
          { height: 'auto', ease: 'power1.inOut', duration: 0.2 },
        )
        .eventCallback('onComplete', () => {
          gsap.fromTo(
            childContent,
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, ease: 'power1.inOut', duration: 0.2 },
          );
        });
    } else {
      gsap
        .fromTo(
          childContent,
          { opacity: 1, x: 0 },
          { opacity: 0, x: -10, ease: 'power1.inOut', duration: 0.2 },
        )
        .eventCallback('onComplete', () => {
          gsap.to(child, { height: 0, ease: 'power1.inOut', duration: 0.2 });
        });
    }
  }

  handleShowActionsChange() {
    const actions = this.actions.nativeElement;
    if (this.showActions) {
      actions.style.display = 'block';

      gsap.fromTo(
        actions,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power1.inOut' },
      );
    } else {
      gsap
        .fromTo(
          actions,
          { opacity: 1, y: 0 },
          { opacity: 0, y: 10, duration: 0.2, ease: 'power1.inOut' },
        )
        .eventCallback('onComplete', () => {
          actions.style.display = 'none';
        });
    }
  }

  setAutoUpdateForActionsPosition() {
    const rowContent = this.rowContent.nativeElement;
    const actions = this.actions.nativeElement;

    this.cleanupAutoUpdateDropdownPosition = autoUpdate(
      rowContent,
      actions,
      this.computeDropdownPosition.bind(this),
    );
  }

  async computeDropdownPosition() {
    const rowContent = this.rowContent.nativeElement;
    const actions = this.actions.nativeElement;

    const data = await computePosition(rowContent, actions, {
      middleware: [
        autoPlacement({
          allowedPlacements: ['bottom-end', 'bottom-start'],
        }),
      ],
    });

    actions.style.left = `${data.x}px`;
    actions.style.top = `${data.y}px`;
  }
}
