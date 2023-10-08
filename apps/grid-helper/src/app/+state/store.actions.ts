import { createAction, props } from '@ngrx/store';
import { StoreEntity } from './store.models';
import { Grid_Options, OptionalFromTo, Section, Tab } from '../../../../../libs/fields/src/models/grid-options.model';

export const initStore = createAction('[Store Page] Init');

export const loadStoreSuccess = createAction(
  '[Store/API] Load Store Success',
  props<{ store: StoreEntity[] }>()
);

export const loadStoreFailure = createAction(
  '[Store/API] Load Store Failure',
  props<{ error: any }>()
);

export const add_grid = createAction(
    '[Store/API] Add Grid',
    props<{ tab: Tab }>()
);

export const add_row = createAction(
    '[Store/API] Add Row',
    props<{ grid_id: string | number }>()
);

export const add_col = createAction(
    '[Store/API] Add Column',
    props<{ grid_id: string }>()
);

export const remove_row = createAction(
    '[Store/API] Remove Row',
    props<{ grid_id: string | number, index: number }>()
);

export const remove_col = createAction(
    '[Store/API] Remove Column',
    props<{ grid_id: string | number, index: number }>()
);
export const remove_grid = createAction(
    '[Store/API] Remove Grid',
    props<{ id: string | number }>()
);

export const formSuccessAction = createAction(
    '[Store/API] Form Submit Success',
    props<{ path: string }>()
);
export const formErrorAction = createAction(
    '[Store/API] Form Submit Error',
    props<{ path: string, error: string }>()
);

export const update_tab = createAction(
    '[Store/API] Update Tab',
    props<{ id: string, value: Tab }>()
);
export const update_grid = createAction(
    '[Store/API] Update Grid',
    props<{ id: number | string, value: Grid_Options }>()
);

export const select_grid = createAction(
    '[Store/API] Select Grid',
    props<{ id: string }>()
);

export const add_section = createAction(
    '[Store/API] Add Section',
    props<{ grid_id: string, section: Section }>()
);

export const remove_section = createAction(
    '[Store/API] Remove Section',
    props<{ grid_id: string, index: number }>()
);

export const update_specifier = createAction(
    '[Store/API] Update Specifier',
    props<{ grid_id: string, value: OptionalFromTo }>()
);

export const toggle_focus_mode = createAction(
    '[Store/API] Toggle Focus Mode'
);
