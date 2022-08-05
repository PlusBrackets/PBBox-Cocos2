import Dictionary from "../Core/Variables/Dictionary";
// import { SceneName } from "./GameGlobal";

const resourcesCfgPath = "PBBox/resourcesCfgs";

export type ResouceCfg = Partial<{
    assetBundle: string;
    loads?: string[];
    dirs?: string[];
}>

export class SceneResCfg {
    sceneName: string = null;
    resCfg: ResouceCfg[] = [];
    loadScene: { asseBundle: string, scene: string } = null;
}

export enum LoadState {
    None,
    LoadCfg,
    LoadBundle,
    LoadRes
}

/**
 * 游戏bundle资源管理，暂时只管load不管release
 */
export default class BundleManager {

    private static _instance: BundleManager = null;
    static get instance() {
        if (this._instance == null)
            this._instance = new BundleManager();
        return this._instance;
    }

    resConfig: Dictionary<SceneResCfg> = null;
    private loadingProgress: Dictionary<number[]> = new Dictionary<number[]>();

    private constructor() { }

    private _loadingScene: string = null;
    get loadingScene() {
        return this._loadingScene;
    }

    private _loadState = LoadState.None;
    get loadState() {
        return this._loadState;
    }

    private progressValues: Array<number[]> = null;
    private _progressNum = [0, 0];

    /**[当前加载的数量，需要加载的总量] */
    get progressNum(): number[] {
        if (!this.progressValues) {
            this._progressNum[0] = 0;
            this._progressNum[1] = 0;
        }
        return this._progressNum;
    }

    /**当前加载的进度 */
    get progress(): number {
        let p = this.progressNum;
        if (p[1] != 0)
            return p[0] / p[1];
        else
            return 0;
    }

    /**从resource文件夹中获取配置文件 */
    private GetResourcesCfg(onComplete: Function) {
        let thisArg = this;
        if (!!!this.resConfig) {
            cc.resources.load(resourcesCfgPath, cc.JsonAsset, (err, asset: cc.JsonAsset) => {
                if (!!err) {
                    return onComplete(err);
                }
                thisArg.InitResConfig(asset.json);
                cc.resources.release(resourcesCfgPath);
                onComplete();
            });
        }
        else
            onComplete();
    }

    /**读取场景资源，会利用resouceCfgs文件读取对应的资源 */
    LoadSceneRes(sceneName: string, onComplete: Function = null, addCfgs: ResouceCfg[] = null) {

        if (this.loadState != LoadState.None) {
            console.error("正在加载中,无法重复加载");
            return;
        }

        this._loadState = LoadState.LoadCfg;
        this._loadingScene = sceneName;
        this.loadingProgress.Clear();
        this.progressValues = null;
        this.GetResourcesCfg((err) => {
            if (!!err) {
                this.OnFinish();
                return onComplete(err);
            }
            this.CheckAndLoadBundle(onComplete, addCfgs);
        })

    }

    /**预加载资源 */
    PreLoadSceneRes(sceneName: string, addCfgs: ResouceCfg[] = null) {
        let thisArg = this;
        this.GetResourcesCfg((err) => {
            if (!!err)
                return;
            let cfg = thisArg.resConfig.Get(sceneName);
            if (!!!cfg) {
                cc.director.preloadScene(sceneName);
                return;
            }
            let bundles = thisArg.GetCfgsBundlesName(cfg, addCfgs);
            thisArg.RequestCfgsBundles(bundles, (err) => {
                if (!!err)
                    return;
                //开始加载
                if (!!cfg.resCfg)
                    cfg.resCfg.forEach(e => {
                        let bundle = cc.assetManager.getBundle(e.assetBundle);
                        if (!!e.loads)
                            e.loads.forEach(l => bundle.preload(l));
                        if (!!e.dirs)
                            e.dirs.forEach(d => bundle.preloadDir(d));
                    });
                if (!!addCfgs)
                    addCfgs.forEach(e => {
                        let bundle = cc.assetManager.getBundle(e.assetBundle);
                        if (!!e.loads)
                            e.loads.forEach(l => bundle.preload(l));
                        if (!!e.dirs)
                            e.dirs.forEach(d => bundle.preloadDir(d));
                    });
                if (!!cfg.loadScene) {
                    if (!!cfg.loadScene.asseBundle) {
                        let bundle = cc.assetManager.getBundle(cfg.loadScene.asseBundle);
                        bundle.preloadScene(cfg.loadScene.scene);
                    }
                    else {
                        cc.director.preloadScene(cfg.loadScene.scene);
                    }
                }

            });
        })
    }

    private GetCfgsBundlesName(cfg: SceneResCfg, addCfgs: ResouceCfg[]): string[] {
        let bundles: string[] = [];
        //计算bundle数量
        if (!!cfg.resCfg)
            cfg.resCfg.forEach(e => {
                if (bundles.indexOf(e.assetBundle) < 0)
                    bundles.push(e.assetBundle);
            });
        if (!!addCfgs)
            addCfgs.forEach(e => {
                if (bundles.indexOf(e.assetBundle) < 0)
                    bundles.push(e.assetBundle);
            });
        if (!!cfg.loadScene && !!cfg.loadScene.asseBundle)
            if (bundles.indexOf(cfg.loadScene.asseBundle) < 0)
                bundles.push(cfg.loadScene.asseBundle);
        return bundles;
    }

    private RequestCfgsBundles(bundles: string[], onComplete: (err: Error) => void): number {
        let count = bundles.length;
        bundles.forEach(b => {
            let bundle = cc.assetManager.getBundle(b);
            if (!!bundle)
                count--;
            else {
                console.log(b);
                cc.assetManager.loadBundle(b, (err) => {
                    if (!!err) {
                        return onComplete(err);
                    }
                    count--;
                    if (count == 0)
                        onComplete(null);
                });
            }
        });
        if (count == 0)
            onComplete(null);
        return count;
    }

    private CheckAndLoadBundle(onComplete: Function = null, addCfgs: any = null) {
        if (this.loadState != LoadState.LoadCfg) {
            console.error("正在加载中,无法重复加载");
            return;
        }
        this._loadState = LoadState.LoadBundle;

        let cfg = this.resConfig.Get(this._loadingScene);
        if (!!!cfg) {
            let sn = this.loadingScene;
            this.OnFinish();
            console.log("没有找到对应场景的资源配置,尝试直接加载资源");
            onComplete(null, sn);
            return;
        }
        let bundles = this.GetCfgsBundlesName(cfg, addCfgs);
        // this.loadCount = bundles.length;

        let thisArg = this;
        // console.log("加载bundle:" + this.loadCount);
        this.RequestCfgsBundles(bundles, (err) => {
            if (!!err) {
                thisArg.OnFinish();
                return onComplete(err);
            }
            thisArg.StartLoadRes(cfg, onComplete, addCfgs);
        });
    }

    private StartLoadRes(cfg: SceneResCfg, onComplete: Function, addCfgs: ResouceCfg[]) {
        if (this.loadState != LoadState.LoadBundle) {
            console.error("正在加载中,无法重复加载");
            return;
        }
        this._loadState = LoadState.LoadRes;
        let loadCount = 0;
        //计算加载数量
        if (!!cfg.resCfg)
            cfg.resCfg.forEach(e => {
                loadCount += (!!e.loads ? e.loads.length : 0);
                loadCount += (!!e.dirs ? e.dirs.length : 0);
            })
        if (cfg.loadScene != null)
            loadCount++;
        if (!!addCfgs)
            addCfgs.forEach(e => {
                loadCount += (!!e.loads ? e.loads.length : 0);
                loadCount += (!!e.dirs ? e.dirs.length : 0);
            });
        console.log("资源数量:" + loadCount)

        let thisArg = this;
        let callBack = (err) => {
            if (!!err) {
                thisArg.OnFinish();
                return onComplete(err);
            }
            loadCount--;
            if (loadCount == 0) {
                let sn = this._loadingScene;
                thisArg.OnFinish();
                onComplete(null, sn);
            }
        };

        //开始加载
        if (!!cfg.resCfg)
            cfg.resCfg.forEach(e => {
                let bundle = cc.assetManager.getBundle(e.assetBundle);
                if (!!e.loads)
                    e.loads.forEach(l => bundle.load(l, (finish, total, item) => thisArg.OnProgress(l, finish, total, item), callBack));
                if (!!e.dirs)
                    e.dirs.forEach(d => bundle.loadDir(d, (finish, total, item) => thisArg.OnProgress(d, finish, total, item), callBack));
            });
        if (!!addCfgs)
            addCfgs.forEach(e => {
                let bundle = cc.assetManager.getBundle(e.assetBundle);
                if (!!e.loads)
                    e.loads.forEach(l => bundle.load(l, (finish, total, item) => thisArg.OnProgress(l, finish, total, item), callBack));
                if (!!e.dirs)
                    e.dirs.forEach(d => bundle.loadDir(d, (finish, total, item) => thisArg.OnProgress(d, finish, total, item), callBack));
            });
        if (!!cfg.loadScene) {
            if (!!cfg.loadScene.asseBundle) {
                let bundle = cc.assetManager.getBundle(cfg.loadScene.asseBundle);
                bundle.preloadScene(cfg.loadScene.scene, (finish, total, item) => thisArg.OnProgress(cfg.loadScene.scene, finish, total, item), callBack);
            }
            else {
                cc.director.preloadScene(cfg.loadScene.scene, (finish, total, item) => thisArg.OnProgress(cfg.loadScene.scene, finish, total, item), callBack);
            }
        }
    }

    private OnProgress(resName: string, finish: number, total: number, item: cc.AssetManager.RequestItem) {
        if (!this.loadingProgress.Has(resName)) {
            this.loadingProgress.Set(resName, [finish, total]);
            this.progressValues = this.loadingProgress.Values();
        }
        else {
            let p = this.loadingProgress.Get(resName);
            p[0] = finish;
            p[1] = total;
        }
        this._progressNum[0] = 0;
        this._progressNum[1] = 0;
        this.progressValues.forEach(e => {
            this._progressNum[0] += e[0];
            this._progressNum[1] += e[1];
        });
    }

    private OnFinish() {
        this._loadState = LoadState.None;
        this._loadingScene = null;
    }

    private InitResConfig(json: any) {
        this.resConfig = new Dictionary<SceneResCfg>();
        json.forEach(e => {
            this.resConfig.Set(e.sceneName, e as SceneResCfg);
        });
    }

    /**加载res */
    LoadRes(bundle: string, res: string | string[], type: typeof cc.Asset,
        onComplete: (err?: Error, asset?: cc.Asset | cc.Asset[] | cc.AssetManager.RequestItem[]) => void,
        onProgress: (finish: number, total: number, item?: cc.AssetManager.RequestItem) => void = null, isPreload = false) {
        let b = cc.assetManager.getBundle(bundle);
        let f = (err, bundle: cc.AssetManager.Bundle) => {
            if (!!err) {
                return onComplete(err);
            }
            if (typeof res === "string")
                isPreload ? bundle.preload(res, type, onProgress, onComplete) : bundle.load(res, type, onProgress, onComplete);
            else
                isPreload ? bundle.preload(res, type, onProgress, onComplete) : bundle.load(res, type, onProgress, onComplete);
        }
        if (!!b) {
            f(null, b);
        }
        else {
            cc.assetManager.loadBundle(bundle, f);
        }
    }

    LoadDir(bundle: string, path: string, type: typeof cc.Asset,
        onComplete: (err?: Error, asset?: cc.Asset[] | cc.AssetManager.RequestItem[]) => void,
        onProgress: (finish: number, total: number, item?: cc.AssetManager.RequestItem) => void = null, isPreload = false) {
        let b = cc.assetManager.getBundle(bundle);
        let f = (err, bundle: cc.AssetManager.Bundle) => {
            if (!!err) {
                return onComplete(err);
            }
            isPreload ? bundle.preloadDir(path, type, onProgress, onComplete) : bundle.loadDir(path, type, onProgress, onComplete);
        }
        if (!!b) {
            f(null, b);
        }
        else {
            cc.assetManager.loadBundle(bundle, f);
        }
    }

}
