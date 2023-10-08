import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as StoreActions from './store.actions';
import { StoreEffects } from './store.effects';
import { StoreFacade } from './store.facade';
import { StoreEntity } from './store.models';
import {
  STORE_FEATURE_KEY,
  StoreState,
  storeReducer,
} from './store.reducer';

interface TestSchema {
  store: StoreState;
}

describe('StoreFacade', () => {
  let facade: StoreFacade;
  let store: Store<TestSchema>;
  const createStoreEntity = (id: string, name = ''): StoreEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(STORE_FEATURE_KEY, storeReducer),
          EffectsModule.forFeature([StoreEffects]),
        ],
        providers: [StoreFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(StoreFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadStoreSuccess` to manually update list
     */
    it('allStore$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        StoreActions.loadStoreSuccess({
          store: [createStoreEntity('AAA'), createStoreEntity('BBB')],
        })
      );

      list = await readFirst(facade.allStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
