import type { FrameworkLifeCycles, LoadableApp, ObjectType } from '../interfaces';

const rawPublicPath = window.cdnUrl;
const planetDataBox: string[] = [];

export default function getAddOn(global: Window, publicPath = '/'): FrameworkLifeCycles<any> {
  /// 为了兼容小贝星球
  /// 增加一个 cdnUrl
  const publicPathRemoveProtocol = publicPath.replace(/\/$/, '').replace('http://', '').replace('https://', '');

  const compatiblePlanet = (app: LoadableApp<ObjectType>) => {
    // eslint-disable-next-line no-param-reassign
    global.cdnUrl = publicPathRemoveProtocol;

    const setWindowVar = (key: string, value: any) => {
      // @ts-ignore
      window[key] = value;

      /// 记录下来方便unmount的时候删除. 避免脏数据
      planetDataBox.push(key);
    };

    /// 为了兼容小贝星球.
    /// 因为一些技术历史遗留原因.
    /// egret 启动时传入props比较困难.
    /// 所以 小贝团队 采用了将通信变量直接写在 windows的方式.
    /// 由于 single-spa 启动app时会将 html 内的windows隔离.
    /// 所以无法在index.html写入变量到windows方便 egret 内使用.
    /// 故这里做了一个兼容.
    /// 需要注意的是.虽然这里做了兼容.但是依旧应该确保小贝团队使用较少的global变量或者加一些特殊前缀以防止重名等问题.
    if (app.name === 'planet') {
      // eslint-disable-next-line no-restricted-syntax
      for (const p in global) {
        if ((window[p] === null || window[p] === undefined) && global[p] !== null && global[p] !== undefined) {
          setWindowVar(p, global[p]);
        }
      }

      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      global.set = (name: string, value: string) => {
        setWindowVar(name, value);
      };
    }
  };

  return {
    async beforeLoad(app) {
      compatiblePlanet(app);
    },

    async beforeMount(app) {
      compatiblePlanet(app);
    },

    async beforeUnmount(app) {
      if (rawPublicPath === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete global.cdnUrl;
      } else {
        // eslint-disable-next-line no-param-reassign
        global.cdnUrl = rawPublicPath;
      }

      if (app.name === 'planet') {
        // 清理小贝星球遗留的脏数据.
        while (planetDataBox.length) {
          const key = planetDataBox.shift();
          if (key) {
            // @ts-ignore
            delete window[key];
          }
        }
      }
    },
  };
}
