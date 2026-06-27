import { enableProdMode, NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

enableProdMode();
ModuleRegistry.registerModules([AllCommunityModule]);

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    return bootstrapApplication(App, {
      providers: [...(appConfig.providers ?? []), ...getSingleSpaExtraProviders()],
    });
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
