/// 为了满足icw定制化props需求
/// 并且考虑到后续 pick qiankun 的 bugfix 减少冲突
/// 增加这个文件
import { merge } from 'lodash';
import type { ObjectType } from '../index';
import { goto, gotoWithNewTab } from './goto';

type PropsHook = (originalProps: ObjectType, appInstanceId: string) => ObjectType;

const propsHooks: PropsHook[] = [];

const getCustomizeProps = () => {
  // 将query assign到 props;

  const propsFromQuery: ObjectType = {};
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.forEach((value, key) => {
    /// TODO.
    /// 加一些关键字校验的逻辑.
    propsFromQuery[key] = value;
  });

  return {
    goto,
    gotoWithNewTab,
    ...propsFromQuery,
  };
};

export const mergeProps = (original: ObjectType, appInstanceId: string) => {
  let mergedProps = merge(original, getCustomizeProps());
  propsHooks.forEach((hook) => {
    mergedProps = merge(mergedProps, hook(mergedProps, appInstanceId));
  });
  return mergedProps;
};

// 提供使用方扩展mount props的权限
export const propsHook = (hook: PropsHook) => {
  propsHooks.push(hook);
};
