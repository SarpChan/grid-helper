import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnInit,
    ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreFacade } from '../+state/store.facade';
import { ElementComponent } from '../element/element.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, withLatestFrom } from 'rxjs';
import { generate_color } from '../../../../../libs/generation/src/color.util';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreEntity } from '../+state/store.models';

@Component({
    selector: 'grid-helper-preview',
    standalone: true,
    imports: [CommonModule, ElementComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit {

    @ViewChild('previewgrid') grid!: ElementRef<HTMLDivElement>;

    destroyRef = inject(DestroyRef);
    colors: string[] = [];
    width = 0;
    height = 0;
    width_unit: string = 'px';
    width_text: string = '0px';
    resizing: boolean = false;
    touched: boolean = false;
    entity?: StoreEntity;
    used_width_from: 'from' | 'to' | undefined;
    form!: FormGroup;

    constructor(public store: StoreFacade, public cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.store.sections$.pipe(
            distinctUntilChanged((a, b) => a?.length === b?.length),
            withLatestFrom(this.store.selectedGrid$),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(([sections, entity]) => {
            this.colors = generate_color(sections?.length ?? 0);
            this.entity = entity;
            this.determine_size();
        });
    }

    ngAfterViewInit() {
        this.gotest();
    }

    gotest() {
        var ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                const cr = entry.contentRect;
                this.width = cr.width;
                this.height = cr.height;
                this.cdr.detectChanges();
            }
        });

        ro.observe(this.grid.nativeElement);
    }

    save() {
        if (this.entity) {
            let specifier;
            if (this.used_width_from === 'to') {
                specifier = {
                    ...this.entity?.tab.specifier,
                    to: this.width,
                    to_unit: this.width_unit
                };
            } else {
                specifier = {
                    ...this.entity?.tab.specifier,
                    from: this.width,
                    from_unit: this.width_unit
                };
            }

            this.store.update_tab(this.entity.id, {
                    ...this.entity?.tab,
                    specifier
                }
            );

            this.store.toggle_focus_mode();
        }
    }

    determine_size() {
        if (this.touched) {
            this.width_text = this.width + (this.entity?.tab.specifier.from_unit ? this.entity?.tab.specifier.from_unit : this.entity?.tab.specifier.to_unit ? this.entity.tab.specifier.to_unit : 'px');
        } else if (this.entity?.tab.specifier.from) {
            this.width_text = this.entity.tab.specifier.from + '' + this.entity.tab.specifier.from_unit;
            this.used_width_from = 'from';
        } else if (this.entity?.tab.specifier.to) {
            this.width_text = this.entity.tab.specifier.to + '' + this.entity.tab.specifier.to_unit;
            this.used_width_from = 'to';
        } else {
            this.width_text = '100%';
        }
    }

    start_resize() {
        this.resizing = true;
        this.touched = true;
    }

    end_resize() {
        this.resizing = false;
    }
}
