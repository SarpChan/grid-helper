import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, take, takeUntil } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { update_tab } from '../+state/store.actions';

@Directive({
    selector: '[formconnect]',
    standalone: true
})
export class FormconnectDirective implements OnInit, OnDestroy {
    @Input() debounce: number = 300;
    @Input() form_id!: string;
    @Output() error = new EventEmitter();
    @Output() success = new EventEmitter();

    private on_destroy$ = new Subject<void>();

    constructor(private formGroupDirective: FormGroupDirective,
        private actions$: Actions,
        private store: Store<any>) {
    }

    ngOnInit() {
        this.store.select(state => state.forms[this.form_id])
            .pipe(take(1))
            .subscribe(val => {
                this.formGroupDirective.form.patchValue(val);
            });

        this.formGroupDirective.form.valueChanges.pipe(
            debounceTime(this.debounce),
            takeUntil(this.on_destroy$)
        ).subscribe(value => {
            this.store.dispatch(update_tab({id: this.form_id, value}));
        });
    }

    ngOnDestroy() {
        this.on_destroy$.next();
    }
}