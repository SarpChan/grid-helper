import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementComponent } from '../element/element.component';
import {
    Coordinates,
    default_options, Dimension,
    Grid_Options, OptionalFromTo, Section
} from '../../../../../libs/fields/src/models/grid-options.model';
import {
    FormArray,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil, tap } from 'rxjs';
import { isEqual, cloneDeep } from 'lodash-es';
import { generate_color } from '../../../../../libs/generation/src/color.util';
import { CodeResultComponent } from '../code-result/code-result.component';
import { StoreFacade } from '../+state/store.facade';
import { StoreEntity } from '../+state/store.models';
import { Units } from '../../../../../libs/fields/src/models/units';

@Component({
    selector: 'grid-helper-grid-container',
    standalone: true,
    imports: [CommonModule, ElementComponent, ReactiveFormsModule, InputComponent, CodeResultComponent],
    templateUrl: './grid-container.component.html',
    styleUrls: ['./grid-container.component.scss']
})
export class GridContainerComponent implements OnInit, OnDestroy {

    @ViewChild('appDialog', {static: true}) dialog!: ElementRef<HTMLDialogElement>;
    private specifier_options?: OptionalFromTo;

    public set grid_options(value: Grid_Options) {
        this._grid_options = cloneDeep(value);
    };

    public get grid_options() {
        return this._grid_options;
    }

    @Output() public css_output = new EventEmitter<string>();

    public options_form?: FormGroup;
    public specifier_form?: FormGroup;
    public ondestroy$ = new Subject<void>();

    public colors: string[] = [];
    private section_start?: Coordinates;
    private section_end?: Coordinates;
    private _grid_options: Grid_Options = {...default_options};
    public grid?: StoreEntity;
    public unit = Units;

    constructor(private readonly fb: NonNullableFormBuilder,
        public store: StoreFacade,
        private cdr: ChangeDetectorRef) {

    }

    get from_width() {
        return this.specifier_form!.get('from') as FormGroup;
    }

    get to_width() {
        return this.specifier_form!.get('to') as FormGroup;
    }

    get col_gap() {
        return this.options_form!.get('col_gap') as FormGroup;
    }

    get row_gap() {
        return this.options_form!.get('row_gap') as FormGroup;
    }

    get columns() {
        const colForms = this.options_form!.get('columns') as FormArray;
        return colForms.controls as FormGroup[];
    }

    get rows() {
        const rowForms = this.options_form!.get('rows') as FormArray;
        return rowForms.controls as FormGroup[];
    }

    ngOnInit() {
        this.store.selectedGrid$
            .pipe(
                distinctUntilChanged((a, b) => isEqual(a, b)),
                filter((grid) => !!grid),
                takeUntil(this.ondestroy$))
            .subscribe((grid) => {
                if (!grid) {
                    return;
                }
                const grid_change = this.grid?.id !== grid.id;
                this.grid = grid;
                if (grid?.tab) {
                    this.specifier_options = grid.tab.specifier;
                    this.grid_options = grid.tab.grid_options;
                    if (this.options_form) {
                        this.reset(grid_change, false);
                    } else {
                        this.init_specifier();
                        this.init_options_form();
                    }
                }
            });

        this.store.sections$.pipe(
            takeUntil(this.ondestroy$)
        ).subscribe((sections) => {
            this.colors = generate_color(sections?.length ?? 0);
            this.cdr.detectChanges();
        });
    }

    private init_options_form() {
        this.options_form = this.fb.group({
            columns: this.fb.array(this.create_columns_array()),
            rows: this.fb.array(this.create_rows_array()),
            col_gap: this.fb.group({
                value: [this.grid_options.col_gap.value, Validators.required],
                unit: [this.grid_options.col_gap.unit, Validators.required]
            }),
            row_gap: this.fb.group({
                value: [this.grid_options.row_gap.value, Validators.required],
                unit: [this.grid_options.row_gap.unit, Validators.required]
            })
        });

        this.options_form.valueChanges.pipe(
            distinctUntilChanged((a, b) => {
                console.log(a, b)
                return isEqual(a, b);
            }),
            debounceTime(100),
            tap((value) => console.log(value)),
            takeUntil(this.ondestroy$)
        ).subscribe((value) => this.store.update_grid(this.grid?.id ?? '0', value));
    }

    private init_specifier() {
        console.log('init_specifier', this.specifier_options);
        this.specifier_form = this.fb.group({
            from: this.fb.group({
                from: [this.specifier_options?.from],
                unit: [this.specifier_options?.from_unit]
            }),
            to: this.fb.group({
                unit: [this.specifier_options?.to_unit],
                to: [this.specifier_options?.to]
            })
        });

        this.specifier_form.valueChanges.pipe(
            distinctUntilChanged((a, b) => {
                return isEqual(a, b);
            }),
            debounceTime(200),
            takeUntil(this.ondestroy$)
        ).subscribe((value) => {
            console.log('reached');
            this.store.update_secifier(this.grid?.id ?? '0', {
                from: value.from.from,
                from_unit: value.from.unit,
                to: value.to.to,
                to_unit: value.to.unit
            });
        });
    }

    ngOnDestroy() {
        this.options_form!.reset();
        this.dialog.nativeElement.removeEventListener('click', this.listen_outside_click);
    }

    create_columns_array() {
        return this.grid_options.columns.map((column) =>
            this.fb.group({
                id: column.id,
                value: [column.value, Validators.required],
                unit: [column.unit, Validators.required]
            }));
    }

    create_rows_array() {
        return this.grid_options.rows.map((row) =>
            this.fb.group({
                id: row.id,
                value: [row.value, Validators.required],
                unit: [row.unit, Validators.required]
            }));
    }

    add_col() {
        const new_col = {value: 1, unit: 'fr'} as Dimension;
        (this.options_form!.get('columns') as FormArray).push(this.fb.group({
            id: [crypto.randomUUID, Validators.required],
            value: [new_col.value, Validators.required],
            unit: [new_col.unit, Validators.required]
        }));
    }

    remove_col(index: number) {
        (this.options_form!.get('columns') as FormArray).removeAt(index);
    }

    remove_row(index: number) {
        (this.options_form!.get('rows') as FormArray).removeAt(index);
    }

    add_row() {
        const new_row = {value: 1, unit: 'fr'} as Dimension;

        (this.options_form!.get('rows') as FormArray).push(this.fb.group({
            id: [crypto.randomUUID, Validators.required],
            value: [new_row.value, Validators.required],
            unit: [new_row.unit, Validators.required]
        }));
    }

    generate_code() {
        this.dialog.nativeElement.showModal();
        this.dialog.nativeElement.addEventListener('click', this.listen_outside_click.bind(this));
    }

    listen_outside_click(event: MouseEvent) {
        if (event.target === this.dialog.nativeElement) {
            this.dialog.nativeElement.close();
        }
    }

    start_section(row: number, col: number) {
        this.section_start = {
            x: col,
            y: row
        };
    }

    end_section(row: number, col: number) {
        this.section_end = {
            x: col,
            y: row
        };
        this.define_section();
    }

    define_section() {
        if (this.section_start !== undefined && this.section_end !== undefined) {
            const [min_x, max_x] = (this.section_start!.x ?? 0) < this.section_end.x ? [this.section_start!.x, this.section_end.x] : [this.section_end.x, this.section_start!.x];
            const [min_y, max_y] = (this.section_start!.y ?? 0) < this.section_end.y ? [this.section_start!.y, this.section_end.y] : [this.section_end.y, this.section_start!.y];

            const from: Coordinates = {x: min_x, y: min_y};
            const to: Coordinates = {x: max_x, y: max_y};

            const new_section: Section = {from, to};

            this.store.add_section(this.grid?.id ?? '0', new_section);
            this.section_start = undefined;
            this.section_end = undefined;
        }
    }

    remove_section(index: number) {
        this.store.remove_section(this.grid?.id ?? '0', index);
    }

    reset(grid_change: boolean, to_default = true) {
        this.reset_cols_and_rows(grid_change, to_default);
        this.reset_specifier(to_default);
    }

    reset_specifier(to_default: boolean = true) {
        this.specifier_form?.reset(to_default ? {
            from: {
                from: undefined,
                unit: 'px'
            },
            to: {
                unit: 'px',
                to: undefined
            }
        } : {
            from: {
                from: this.specifier_options?.from,
                from_unit: this.specifier_options?.from_unit
            },
            to: {
                to_unit: this.specifier_options?.to_unit,
                to: this.specifier_options?.to
            }
        });
        this.cdr.detectChanges();
    }

    reset_cols_and_rows(grid_change: boolean, to_default: boolean = true) {
        const options = cloneDeep(to_default ? default_options : this.grid_options);
        const cols = (this.options_form?.get('columns') as FormArray);
        const rows = (this.options_form?.get('rows') as FormArray);
        const cLen = cols.length;

        if (cLen < options.columns.length) {
            for (let i = 0; i < options.columns.length - cLen; i++) {
                this.add_col();
            }
        } else if (cLen > options.columns.length) {
            for (let i = 0; i < cLen - options.columns.length; i++) {
                this.remove_col(0);
            }
        }

        const rLen = rows.length;
        if (rLen < options.rows.length) {
            for (let i = 0; i < options.rows.length - rLen; i++) {
                this.add_row();
            }
        } else if (rLen > options.rows.length) {
            for (let i = 0; i < rLen - options.rows.length; i++) {
                this.remove_row(0);
            }
        }

        if (grid_change) {
            cols.controls.forEach((col, index) => {
                col.patchValue(options.columns[index]);
            });

            rows.controls.forEach((row, index) => {
                row.patchValue(options.rows[index]);
            });
        }
    }

    dimensionById(index: number, dimension: Dimension) {
        return dimension.id;
    }
}
