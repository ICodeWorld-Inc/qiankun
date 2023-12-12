/// 方便应用间的跳转

import type { ObjectType } from '../index';
import { navigateToUrl } from 'single-spa';

let inited = false;
let getPathByAppName: getPathByAppNameFunc | undefined;

export type getPathByAppNameFunc = (appName: string) => string | null;

export const init = (fn: getPathByAppNameFunc) => {
  if (inited) {
    throw new Error('Already initialized');
  }
  inited = true;
  getPathByAppName = fn;
};

function genURL(appName: string, props: ObjectType) {
  if (!getPathByAppName) {
    throw new Error('The Function getPathByAppName is undefined');
  }

  const path = getPathByAppName(appName);

  if (path === null) {
    return null;
  }

  /// props assign to query
  const objectAsQueryParams = (object: ObjectType) => {
    return Object.keys(object)
      .map((key) => `${key}=${encodeURIComponent(object[key])}`)
      .join('&');
  };

  return `${path}?${objectAsQueryParams({ ...props })}`;
}

/**
 * 根据应用名称跳转
 * @param appName
 * @param props
 */
export const goto = (appName: string, props: ObjectType): void => {
  const url = genURL(appName, props);

  if (url != null) {
    navigateToUrl(url);
    return;
  }

  console.warn('not gen url', appName);
};

/**
 * 根据应用名称跳转
 * @param appName
 * @param props
 */
export const gotoWithNewTab = (appName: string, props: ObjectType): void => {
  const url = genURL(appName, props);

  if (url != null) {
    window.open(url);
    return;
  }

  console.warn('not gen url', appName);
};
