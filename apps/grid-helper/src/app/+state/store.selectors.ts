import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STORE_FEATURE_KEY, StoreState } from './store.reducer';
import {
    generate_css_for_grid,
    generate_html,
    generate_optimizable,
    generate_optimized
} from '../../../../../libs/generation/src/generation.util';
import { OptionalFromTo } from '../../../../../libs/fields/src/models/grid-options.model';

// Lookup the 'Store' feature state managed by NgRx
export const select_store_state =
    createFeatureSelector<StoreState>(STORE_FEATURE_KEY);

export const select_store_loaded = createSelector(
    select_store_state,
    (state: StoreState) => state.loaded
);

export const select_store_error = createSelector(
    select_store_state,
    (state: StoreState) => state.error
);

export const select_store_entities = createSelector(
    select_store_state,
    (state: StoreState) => {
        return state.grids;
    }
);

export const selectSelectedId = createSelector(
    select_store_state,
    (state: StoreState) => state.selectedId
);

export const select_selected = createSelector(
    select_store_entities,
    selectSelectedId,
    (entities, selectedId) => {
        return selectedId ? entities.find(entity => entity.id === selectedId) : undefined;
    }
);

export const select_sections = createSelector(
    select_selected,
    (selected) => {
        return selected?.tab.sections;
    }
);

export const select_unoptimized_code = createSelector(
    select_selected,
    (selected) => {
        if (selected) {
            const columns = selected.tab.grid_options.columns;
            const rows = selected.tab.grid_options.rows;
            const col_gap = selected.tab.grid_options.col_gap;
            const row_gap = selected.tab.grid_options.row_gap;
            const sections = selected.tab.sections ?? [];

            return generate_optimizable({columns, rows, col_gap, row_gap, sections}, false);
        }

        return undefined;
    }
);

export const select_optimized_code = createSelector(
    select_selected,
    (selected) => {

        if (selected) {
            const columns = selected.tab.grid_options.columns;
            const rows = selected.tab.grid_options.rows;
            const col_gap = selected.tab.grid_options.col_gap;
            const row_gap = selected.tab.grid_options.row_gap;
            const sections = selected.tab.sections ?? [];

            const generation_model = {columns, rows, col_gap, row_gap, sections};
            const css_text = generate_optimized(generation_model);
            const html_text = generate_html(generation_model);
            return {css_text, html_text};
        }

        return undefined;
    }
);

export const select_optimized_code_all_tabs = createSelector(
    select_store_entities,
    (entities) => {
        const grid_with_max_number_of_sections = entities.reduce((acc, curr) => {
            const sections = curr.tab.sections ?? [];
            return sections.length > (acc.tab.sections?.length ?? 0) ? curr : acc;
        }, entities[0]);

        const max_number_of_sections = grid_with_max_number_of_sections.tab.sections?.length ?? 0;

        const columns = grid_with_max_number_of_sections.tab.grid_options.columns;
        const rows = grid_with_max_number_of_sections.tab.grid_options.rows;
        const col_gap = grid_with_max_number_of_sections.tab.grid_options.col_gap;
        const row_gap = grid_with_max_number_of_sections.tab.grid_options.row_gap;
        const sections = grid_with_max_number_of_sections.tab.sections ?? [];

        const generation_model = {columns, rows, col_gap, row_gap, sections};
        const html_text = generate_html(generation_model);

        const determine_comparator_based_on_from_and_to = (a: OptionalFromTo, b: OptionalFromTo) => {
            if (a.from !== undefined && b.from !== undefined) {
                return a.from - b.from;
            } else if (a.from !== undefined && b.from === undefined) {
                return a.from - (b.to ?? 0);
            } else if (a.from === undefined && b.from !== undefined) {
                return (a.to ?? 0) - b.from;
            } else {
                return (a.to ?? 0) - (b.to ?? 0);
            }
        }

        const ordered_grids_by_from = [...entities].sort((a, b) =>
            determine_comparator_based_on_from_and_to(a.tab.specifier, b.tab.specifier));


        const ordered_text_objects = ordered_grids_by_from.map((grid, index) =>
            generate_css_for_grid(grid, max_number_of_sections, index !== 0)
        );

        console.log(ordered_text_objects.join(''));

        return {
            html_text: html_text,
            generation_for: 'both',
            css_text: ordered_text_objects.join(''),
            error: null,
        }
    }
);

export const select_focus_mode = createSelector(
    select_store_state,
    (state: StoreState) => state.focuse_mode
);
