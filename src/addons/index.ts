/**
 * @author Kuitos
 * @since 2020-03-02
 */

import { concat, mergeWith } from 'lodash';
import type { FrameworkLifeCycles, ObjectType } from '../interfaces';

import getRuntimePublicPathAddOn from './runtimePublicPath';
import getEngineFlagAddon from './engineFlag';
import getPlanetRuntimePublicPath from './planetRuntimePublicPath';
import getMarketplaceRuntimePublicPath from './marketplaceRuntimePublicPath';

export default function getAddOns<T extends ObjectType>(global: Window, publicPath: string): FrameworkLifeCycles<T> {
  return mergeWith(
    {},
    getEngineFlagAddon(global),
    getRuntimePublicPathAddOn(global, publicPath),
    getPlanetRuntimePublicPath(global, publicPath),
    getMarketplaceRuntimePublicPath(global, publicPath),
    (v1, v2) => concat(v1 ?? [], v2 ?? []),
  );
}
