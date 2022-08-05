
// import { Component, director, instantiate, Prefab, _decorator, Node, Enum, Asset } from "cc";
import ShareVariables from "../Core/BehaviourTree/ShareVariables";
import BundleManager, { ResouceCfg, LoadState } from "./BundleManager";
import { UItem_FadeScreen } from "./Effects/Effect_FadeScene";
import { PBPools } from "./PBPool";
import BaseUI from "./UI/BaseUI";

const { ccclass, property, menu } = cc._decorator;
const LoadingSceneName = "Loading";
// @ccclass("PoolResConfig")
// export class PoolResConfig {
//     @property(Prefab)
//     prefab: Prefab = null;
//     @property({ tooltip: "初始化时预创建的个数" })
//     initCount: number = 1;
//     // @property({ tooltip: "是否不跟随场景销毁，若是，则从globalPool中取对象" })
//     // dontDestory: boolean = false;
// }

export enum UIResOpenCfg {
    default,
    open,
    close
}

@ccclass("UIResConfig")
export class UIResConfig {
    @property(cc.Prefab)
    prefab: cc.Prefab = null as any;
    @property({ type: cc.Node, tooltip: "ui的父Node,若为null则选择defaultUILayer" })
    parent: cc.Node = null as any;
    @property({ tooltip: "是否默认打开", type: cc.Enum(UIResOpenCfg) })
    defaultOpen: UIResOpenCfg = UIResOpenCfg.default;
}

type LoadSceneCallBackFunc = (err: Error | undefined, sceneName: string | undefined) => void;

export type PoolObjManagerFuncParam = Partial<{
    callBack: (poolObj: cc.Node | null) => void,
    parent: cc.Node;
    param: any;
    resPrePath: string;
    bundleName: string;
}>;

/**管理场景数据 */
@ccclass @menu("System/SceneManager")
export default class SceneManager extends cc.Component {

    private static _instance: SceneManager | null = null;
    static get instance() {
        return this._instance;
    }

    private static _scenePool: PBPools | null = null;
    /**跟随场景的对象池 */
    static get scenePool(): PBPools {
        if (!!!this._scenePool)
            this._scenePool = new PBPools();
        return this._scenePool;
    }
    // private static _audioCaches: Dictionary<AudioClip> = null;
    // /**跟随场景的音频资源*/
    // static get audioCaches() {
    //     if (!!!this._audioCaches)
    //         this._audioCaches = new Dictionary<AudioClip>();
    //     return this._audioCaches;
    // }

    // static RegisterPoolResWithCfg(cfgs: PoolResConfig[]) {
    //     if (!!!cfgs)
    //         return;
    //     cfgs.forEach(cfg => {
    //         SceneManager.scenePool.RegisterObj(cfg.prefab.name, cfg.prefab, cfg.initCount);
    //     });
    // }
    static RegisterPoolRes(prefab: cc.Prefab);
    static RegisterPoolRes(prefabs: cc.Prefab[]);

    static RegisterPoolRes(p: cc.Prefab[] | cc.Prefab) {
        if (!!!p)
            return;
        if (Array.isArray(p)) {
            p.forEach(prefab => {
                SceneManager.scenePool.RegisterObj(prefab.data.name, prefab, 1);
            });
        }
        else{
            SceneManager.scenePool.RegisterObj(p.data.name, p, 1);
        }
    }

    // static RegisterAudioRes(clips: AudioClip[]) {
    //     if (!!!clips)
    //         return;
    //     clips.forEach(c => {
    //         if (!this.audioCaches.Has(c.name))
    //             this.audioCaches.Set(c.name, c);
    //     });
    // }

    /**预加载场景资源，完成后不会自动loadScene,需要使用LoadScene加载 */
    static PreLoadScene(sceneName: string, addRescfgs?: ResouceCfg[]) {
        BundleManager.instance.PreLoadSceneRes(sceneName, addRescfgs);
    }

    /**触发完整转场 */
    static LoadScene(sceneName: string, addRescfgs?: ResouceCfg[], onComplete?: LoadSceneCallBackFunc, thisArg: any = null, antoLoad = true) {
        if (BundleManager.instance.loadState != LoadState.None) {
            console.log("正在loading,无法再次加载");
            return;
        }
        if (!!this.instance) {
            this.instance.loadScene(sceneName, addRescfgs, onComplete as LoadSceneCallBackFunc, thisArg, antoLoad);
        }
        else {
            this.StartLoadScene(sceneName, addRescfgs, onComplete as LoadSceneCallBackFunc, thisArg, antoLoad);
        }

        // let _sn: string;
        // if (typeof (sceneName) == "string")
        //     _sn = sceneName;
        // else
        //     _sn = SceneName[sceneName];
        // director.loadScene(_sn);
    }

    private static StartLoadScene(sceneName: string, addRescfgs: any, onComplete: LoadSceneCallBackFunc, thisArg: any, antoLoad: boolean) {
        console.log("startLoad");
        let func = () => {
            BundleManager.instance.LoadSceneRes(sceneName, (err, sceneName) => {
                if (!!onComplete)
                    onComplete.call(thisArg, err, sceneName);
                SceneManager.OnLoadSceneResComplete(err, sceneName, antoLoad);
            }, addRescfgs);
        };
        if (antoLoad)
            cc.director.loadScene(LoadingSceneName, func);
        else
            func();
    }

    static loadSceneDelay = 0;
    /**调用LoadScene后是否自动加载Scene */

    private static OnLoadSceneResComplete(err: Error | undefined, sceneName: string | undefined, antoLoad: boolean) {
        if (!!err)
            return console.error(err.toString());
        if (!!sceneName) {
            if (!antoLoad) {
                this.loadSceneDelay = 0;
                return;
            }
            if (this.loadSceneDelay > 0 && !!this.instance) {
                let delay = this.loadSceneDelay;
                this.instance.scheduleOnce(() => cc.director.loadScene(sceneName), delay);
                this.loadSceneDelay = 0;
            }
            else {
                cc.director.loadScene(sceneName);
            }

        }
    }

    /**直接loadscene */
    static LoadSceneDirect(sceneName: string) {
        // let _sn: string;
        // if (typeof (sceneName) == "string")
        //     _sn = sceneName;
        // else
        //     _sn = SceneName[sceneName];
        cc.director.loadScene(sceneName);
    }

    /**
     * 生成PoolObject,若未加载进scenePool中则会先加载再生成，ke使用cfg.callBack获取生成的node；若已加载进scenePool则直接返回生成的obj，也可以通过callBack取得返回数据
     * @param prefabName 
     * @param cfg 
     */
    static SpawnObj(prefabName: string, cfg: PoolObjManagerFuncParam): cc.Node | undefined {
        if (!SceneManager.instance)
            !!cfg.callBack && cfg.callBack(null);
        if (cfg.bundleName && cfg.resPrePath && !SceneManager.scenePool.Has(prefabName)) {
            BundleManager.instance.LoadRes(cfg.bundleName, cfg.resPrePath + prefabName, cc.Prefab, (err, prefab) => {
                if (prefab instanceof cc.Prefab && prefab.loaded) {
                    SceneManager.RegisterPoolRes([prefab]);
                    let obj = SceneManager.scenePool.GetObj(prefabName, cfg.parent, cfg.param);
                    !!cfg.callBack && cfg.callBack(obj);
                }
            });
        }
        else {
            let obj = SceneManager.scenePool.GetObj(prefabName, cfg.parent, cfg.param);
            !!cfg.callBack && cfg.callBack(obj);
            return obj;
        }
        return undefined;
    }


    // @property(Canvas)
    // canvas: Canvas = null;
    @property(cc.Node)
    defaultUILayer: cc.Node = null as any;

    // @property({ tooltip: "加载场景后在onload时预先加载的prefab", type: [PoolResConfig] })
    // poolRes: PoolResConfig[] = [];
    @property({ tooltip: "加载场景后在onload时预先加载的prefab", type: [cc.Prefab] })
    poolRes: cc.Prefab[] = [];

    @property({ tooltip: "加载场景在onload时创建ui的prefab", type: [UIResConfig] })
    uiRes: UIResConfig[] = [];

    @property(UItem_FadeScreen)
    fadeScene: UItem_FadeScreen = null as any;

    onLoad() {
        if (SceneManager._instance != null) {
            console.error("重复创建SceneManager！！");
            this.destroy();
            return;
        }
        SceneManager._instance = this;
        // if (!!!this.canvas)
        //     this.canvas = this.getComponent(Canvas);

        // SceneManager.RegisterPoolResWithCfg(this.poolRes);
        SceneManager.RegisterPoolRes(this.poolRes);
        this.CreateUI();
    }

    private CreateUI() {
        if (!this.uiRes || this.uiRes.length === 0)
            return;
        if (!this.defaultUILayer) {
            console.warn("没有设置UILayer,自动设置为sceneManager所在的node");
            this.defaultUILayer = this.node;
            // return;
        }
        this.uiRes.forEach(cfg => {
            let n = cc.instantiate(cfg.prefab);
            let ui = n.getComponent("BaseUI") as BaseUI<any>;
            cfg.defaultOpen !== UIResOpenCfg.default && (ui.defaultOpen = cfg.defaultOpen === UIResOpenCfg.open);
            n.parent = !!cfg.parent ? cfg.parent : this.defaultUILayer;
        });
    }

    private loadScene(sceneName: string, addRescfgs: any, onComplete: LoadSceneCallBackFunc, thisArg: any, autoLoad: boolean) {
        if (!!this.fadeScene && autoLoad) {
            SceneManager.PreLoadScene(sceneName, addRescfgs);
            this.fadeScene.FadeOut(() => {
                SceneManager.StartLoadScene(sceneName, addRescfgs, onComplete, thisArg, autoLoad);
            }, this)
        }
        else
            SceneManager.StartLoadScene(sceneName, addRescfgs, onComplete, thisArg, autoLoad);
    }

    onDestroy() {
        if (SceneManager._instance == this) {
            SceneManager._instance = null;
            if (!!SceneManager._scenePool) {
                SceneManager._scenePool.Clear();
                SceneManager._scenePool = null;
                ShareVariables.Clear();
            }
        }
    }


}
