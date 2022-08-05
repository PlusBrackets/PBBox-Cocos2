// import { _decorator, Vec2, Vec3, resources, Prefab, director, Label, Tween, game, tween, Node, view, UIOpacity } from "cc";
import { PBPoolObj, PBPool } from "../PBPool";

const { ccclass, property, menu, requireComponent } = cc._decorator;

/**填入message的路径 */
const BubbleMessageResPath = "PBBox/BubbleMessage";
const CanvasMark = "UICanvas";

@ccclass @menu("PBBox/UIComponent/BubbleMessage")
export class BubbleMessage extends PBPoolObj {

    private static pool: PBPool;

    static ShowMessage(message: string, pos: cc.Vec2 | cc.Vec3 = null) {
        if (!this.pool) {
            cc.resources.load(BubbleMessageResPath, cc.Prefab, (err, asset: cc.Prefab) => {
                if (!BubbleMessage.pool) {
                    if (asset && asset.loaded) {
                        BubbleMessage.pool = new PBPool(asset, 1);
                        BubbleMessage.SpawnBubble(message, pos);
                    }
                }
                else
                    BubbleMessage.SpawnBubble(message, pos);
            });
        }
        else {
            this.SpawnBubble(message, pos);
        }
    }

    private static SpawnBubble(message: string, pos: cc.Vec2 | cc.Vec3) {
        if (this.pool.pool.size() > 5)
            this.pool.pool.clear();
        let canvas = cc.Canvas.instance; //CanvasMarker.Get(CanvasMark);
        !!canvas && this.pool.Get(canvas.node, { message: message, pos: pos });
    }

    @property(cc.Label)
    label_msg: cc.Label = null;

    @property
    fadeInDuration = 0.2;
    @property
    fadeOutDuration = 0.5;
    @property
    showDuration = 0.5;

    private animTween: cc.Tween = null;
    private defaultPos?: cc.Vec3;

    OnSpawn(data) {
        if (!this.defaultPos) {
            this.defaultPos = new cc.Vec3();
            this.node.getPosition(this.defaultPos);
        }
        this.label_msg.string = data.message;
        let pos = data.pos;
        if (!pos) {
            pos = this.defaultPos;
            // let winSize = view.getVisibleSize();
            // pos = new Vec2(winSize.width / 2, winSize.height / 1.5);
        }
        this.node.setPosition(pos);
        // game.addPersistRootNode(this.node);
        this.TweenShow();
    }

    OnDespawn() {
        this.unscheduleAllCallbacks();
        this.StopTween();
        // game.removePersistRootNode(this.node);
    }

    TweenShow() {
        this.StopTween();
        // if (this.uiOpactiy) {
        this.node.opacity = 0;
        this.animTween = cc.tween(this.node).to(this.fadeInDuration, { opacity: 255 }).start();
        // }
        this.scheduleOnce(this.TweenDisapear, this.fadeInDuration + this.showDuration);
    }

    TweenDisapear() {
        this.StopTween();
        // if (this.uiOpactiy) {
        this.animTween = cc.tween(this.node).to(this.fadeOutDuration, { opacity: 0 }).start();
        // }
        this.scheduleOnce(this.Recycle, this.fadeOutDuration);
    }

    StopTween() {
        if (this.animTween) {
            this.animTween.stop();
            this.animTween = null;
        }
    }
}