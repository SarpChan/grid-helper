import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as StoreActions from './store.actions';
import { StoreEntity } from './store.models';
import { get_default_options } from '../../../../../libs/fields/src/models/grid-options.model';
import { cloneDeep } from 'lodash-es';

export const STORE_FEATURE_KEY = 'store';

export interface StoreState {
    grids: StoreEntity[];
    generation_for: 'html' | 'css' | 'both' | 'tailwind';
    selectedId?: string; // which Store record has been selected
    loaded: boolean; // has the Store list been loaded
    error?: string | null; // last known error (if any)
    focuse_mode: boolean;
    ids: string[];
}

export interface StorePartialState {
    readonly [STORE_FEATURE_KEY]: StoreState;
}

export const storeAdapter: EntityAdapter<StoreEntity> =
    createEntityAdapter<StoreEntity>();

export const initialStoreState: StoreState = {
    grids: [{
        id: '1',
        tab: {
            name: 'Desktop',
            specifier: {from_unit: 'px', to_unit: 'px', from: undefined, to: undefined},
            grid_options: {...get_default_options()},
            sections: []
        }
    }],
    selectedId: '1',
    generation_for: 'both',
    loaded: false,
    focuse_mode: false,
    ids: ['1'],
};

const reducer = createReducer(
    initialStoreState,
    on(StoreActions.initStore, (state) => ({
        ...state,
        loaded: false,
        error: null
    })),
    on(StoreActions.loadStoreFailure, (state, {error}) => ({...state, error})),
    on(StoreActions.update_tab, (state, {id, value}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === id) {
                return {...grid, tab: cloneDeep(value)};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.update_grid, (state, {id, value}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === id) {
                return {...grid, tab: {...grid.tab, grid_options: {...value}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.add_grid, (state, {tab}) => {
        const id = `${state.grids.length + 1}`
        const grids = [...state.grids, {
            id,
            tab: {...tab, sections: []}
        }];
        return {...state, grids, ids: [...state.ids, id]};
    }),
    on(StoreActions.remove_grid, (state, {id}) => {
        const grids = state.grids.filter(grid => grid.id !== id);
        return {...state, grids, ids: state.ids.filter(_id => _id !== id)};
    }),
    on(StoreActions.add_row, (state, {grid_id}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                const rows = [...grid.tab.grid_options.rows, {value: 1, unit: 'fr'}];
                return {...grid, tab: {...grid.tab, grid_options: {...grid.tab.grid_options, rows}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.add_col, (state, {grid_id}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                const columns = [...grid.tab.grid_options.columns, {value: 1, unit: 'fr'}];
                return {...grid, tab: {...grid.tab, grid_options: {...grid.tab.grid_options, columns}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.remove_row, (state, {grid_id, index}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                const rows = grid.tab.grid_options.rows.filter((_, i) => i !== index);
                return {...grid, tab: {...grid.tab, grid_options: {...grid.tab.grid_options, rows}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.remove_col, (state, {grid_id, index}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                const columns = grid.tab.grid_options.columns.filter((_, i) => i !== index);
                return {...grid, tab: {...grid.tab, grid_options: {...grid.tab.grid_options, columns}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.select_grid, (state, {id}) => ({...state, selectedId: id})),
    on(StoreActions.add_section, (state, {grid_id, section}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                if (!grid.tab.sections) {
                    grid.tab.sections = [];
                }
                const sections = [...grid.tab.sections, section];
                return {...grid, tab: {...grid.tab, sections}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.remove_section, (state, {grid_id, index}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                if(!grid.tab.sections){
                    return {...grid, tab: {...grid.tab, sections: []}};
                }
                const sections = grid.tab.sections.filter((el, ind) => ind !== index);
                return {...grid, tab: {...grid.tab, sections}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.update_specifier, (state, {grid_id, value}) => {
        const grids = state.grids.map(grid => {
            if (grid.id === grid_id) {
                return {...grid, tab: {...grid.tab, specifier: {...value}}};
            }
            return grid;
        });
        return {...state, grids};
    }),
    on(StoreActions.toggle_focus_mode, (state) => ({...state, focuse_mode: !state.focuse_mode})),
);

export function storeReducer(state: StoreState | undefined, action: Action) {
    return reducer(state, action);
}
