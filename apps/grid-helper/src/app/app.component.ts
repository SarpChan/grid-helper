import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import {
    default_options
} from '../../../../libs/fields/src/models/grid-options.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Units } from '../../../../libs/fields/src/models/units';
import { StoreFacade } from './+state/store.facade';
import { StoreEntity } from './+state/store.models';
import { filter, Subject, takeUntil } from 'rxjs';
import { PreviewComponent } from './preview/preview.component';
import { CodeResultComponent } from './code-result/code-result.component';

@Component({
    standalone: true,
    imports: [NxWelcomeComponent, RouterModule, CommonModule, TabComponent, ReactiveFormsModule, PreviewComponent, CodeResultComponent],
    selector: 'grid-helper-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    @ViewChild('tabDialog', {static: true}) tab_dialog!: ElementRef<HTMLDialogElement>;
    @ViewChild('generationDialog', {static: true}) generation_dialog!: ElementRef<HTMLDialogElement>;

    title = 'grid-helper';
    output: string | null = null;
    selected_tab?: StoreEntity;

    tabForm: FormGroup = new FormGroup({});
    public units = Object.values(Units);
    destroyed$ = new Subject<void>();
    constructor(private fb: FormBuilder, public facade: StoreFacade) {
    }

    setOutput(css_output: string) {
        this.output = css_output;
    }

    ngOnInit() {
        this.facade.selectedGrid$.pipe(
            filter(tab => !!tab),
            takeUntil(this.destroyed$)
        ).subscribe(tab => {
            this.selected_tab = tab;
        })

        this.tabForm = this.fb.group({
            name: ['Default', Validators.required],
            from: [undefined],
            from_unit: ['px', Validators.required],
            to_unit: ['px', Validators.required],
            to: [undefined],
            cols: [12, Validators.required],
            rows: [4, Validators.required]
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
    }

    add_tab() {
        const form_result = this.tabForm.getRawValue() as {
            name: string,
            from: number | undefined,
            from_unit: string | undefined,
            to: number | undefined,
            to_unit: string | undefined,
            cols: number,
            rows: number
        };
        const options = {...default_options};
        options.columns = Array(form_result.cols).fill({value: 1, unit: 'fr'});
        options.rows = Array(form_result.rows).fill({value: 1, unit: 'fr'});
        this.facade.add_tab({
            name: form_result.name,
            specifier: {
                from: form_result.from,
                from_unit: form_result.from_unit,
                to: form_result.to,
                to_unit: form_result.to_unit
            },
            grid_options: {...options}
        });
        this.tab_dialog.nativeElement.close();
        this.tabForm.reset({
            name: 'default',
            from: undefined,
            from_unit: 'px',
            to_unit: 'px',
            to: undefined,
            cols: 12,
            rows: 4
        });
    }

    open_tab_creation() {
        this.tab_dialog.nativeElement.showModal();
        this.tab_dialog.nativeElement.addEventListener('click', this.listen_outside_click_tab.bind(this));
    }

    listen_outside_click_tab(event: MouseEvent) {
        if (event.target === this.tab_dialog.nativeElement) {
            this.tab_dialog.nativeElement.close();
        }
    }
    listen_outside_click_generation(event: MouseEvent) {
        if (event.target === this.generation_dialog.nativeElement) {
            this.generation_dialog.nativeElement.close();
        }
    }

    remove_tab(tab: StoreEntity) {
        this.facade.remove_grid(tab.id);
    }

    select_tab(tab: StoreEntity) {
        this.facade.select_grid(tab.id);
    }

    generate_code() {
        this.generation_dialog.nativeElement.showModal();
        this.generation_dialog.nativeElement.addEventListener('click', this.listen_outside_click_generation.bind(this));
    }
}
