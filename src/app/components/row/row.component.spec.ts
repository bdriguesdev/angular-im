import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowComponent } from './row.component';
import { SimpleChange } from '@angular/core';

describe('RowComponent', () => {
  let component: RowComponent;
  let fixture: ComponentFixture<RowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #handleIsSelectedChange when #isSelected changes', () => {
    const spy = spyOn(component, 'handleIsSelectedChange');

    component.ngOnChanges({
      isSelected: new SimpleChange(true, false, false)
    });

    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('should call #handleShowChildChange when #showChild changes', () => {
    const spy = spyOn(component, 'handleShowChildChange');

    component.ngOnChanges({
      showChild: new SimpleChange(true, false, false)
    });

    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('should call #handleShowActionsChange when #showActions changes', () => {
    const spy = spyOn(component, 'handleShowActionsChange');

    component.ngOnChanges({
      showActions: new SimpleChange(true, false, false)
    });

    expect(spy).toHaveBeenCalledTimes(1);
  })
});
