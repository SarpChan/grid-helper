import { ApplicationConfig, isDevMode } from '@angular/core';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as fromStore from './+state/store.reducer';
import { StoreEffects } from './+state/store.effects';
import { StoreFacade } from './+state/store.facade';

export const appConfig: ApplicationConfig = {
    providers: [
        provideEffects(),
        provideStore(),
        provideEffects(StoreEffects),
        provideState(fromStore.STORE_FEATURE_KEY, fromStore.storeReducer),
        StoreFacade,
        provideEffects(),
        provideStore(),
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        provideStoreDevtools({logOnly: !isDevMode()})
    ]
};
