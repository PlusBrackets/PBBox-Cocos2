// import { _decorator, Component, Vec3, Node } from "cc";
import BundleManager, { ResouceCfg } from "../BundleManager";

const { ccclass, menu, property } = cc._decorator;

/**屏幕转场 */
@ccclass @menu("PBBox/Motions/ResPreload")
export default class Motion_ResPreload extends cc.Component {
    @property
    preloadOnStart: boolean = false;
    @property
    preloadScene: string = ""

    start() {
        if (this.preloadOnStart)
            this.StartPreload();
    }

    StartPreload() {
        if (this.preloadScene) {
            this.scheduleOnce(()=>{
                BundleManager.instance.PreLoadSceneRes(this.preloadScene);
            },0.5);
        }
    }
}