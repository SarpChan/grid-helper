import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as StoreActions from './store.actions';
import * as StoreSelectors from './store.selectors';
import { Grid_Options, OptionalFromTo, Section, Tab } from '../../../../../libs/fields/src/models/grid-options.model';

@Injectable()
export class StoreFacade {
    private readonly store = inject(Store);

    /**
     * Combine pieces of state using createSelector,
     * and expose them as observables through the facade.
     */
    loaded$ = this.store.pipe(select(StoreSelectors.select_store_loaded));
    selectedGrid$ = this.store.pipe(select(StoreSelectors.select_selected));
    tabs$ = this.store.pipe(select(StoreSelectors.select_store_entities));
    sections$ = this.store.pipe(select(StoreSelectors.select_sections));
    unoptimized_code$ = this.store.pipe(select(StoreSelectors.select_unoptimized_code));
    optimized_code$ = this.store.pipe(select(StoreSelectors.select_optimized_code));
    optimized_code_all_tabs$ = this.store.pipe(select(StoreSelectors.select_optimized_code_all_tabs));
    focus_mode$ = this.store.pipe(select(StoreSelectors.select_focus_mode));
    add_row(grid_id: string) {
        this.store.dispatch(StoreActions.add_row({grid_id}));
    }

    add_col(grid_id: string) {
        this.store.dispatch(StoreActions.add_col({grid_id}));
    }

    remove_row(grid_id: string, index: number) {
        this.store.dispatch(StoreActions.remove_row({grid_id, index}));
    }

    remove_col(grid_id: string, index: number) {
        this.store.dispatch(StoreActions.remove_col({grid_id, index}));
    }

    remove_grid(id: string) {
        this.store.dispatch(StoreActions.remove_grid({id}));
    }

    formSuccessAction(path: string) {
        this.store.dispatch(StoreActions.formSuccessAction({path}));
    }

    formErrorAction(path: string, error: string) {
        this.store.dispatch(StoreActions.formErrorAction({path, error}));
    }

    update_tab(id: string, value: Tab) {
        this.store.dispatch(StoreActions.update_tab({id, value}));
    }
    update_grid(id: string, value: Grid_Options) {
        this.store.dispatch(StoreActions.update_grid({id, value}));
    }

    select_grid(id: string) {
        this.store.dispatch(StoreActions.select_grid({id}));
    }

    add_tab(tab: Tab) {
        this.store.dispatch(StoreActions.add_grid({tab}));
    }

    add_section(grid_id: string, section: Section) {
        this.store.dispatch(StoreActions.add_section({grid_id, section}));
    }

    remove_section(grid_id: string, index: number) {
        this.store.dispatch(StoreActions.remove_section({grid_id, index}));
    }

    update_secifier(grid_id: string, value: OptionalFromTo) {
        this.store.dispatch(StoreActions.update_specifier({grid_id, value}));
    }

    toggle_focus_mode() {
        this.store.dispatch(StoreActions.toggle_focus_mode());
    }
}

