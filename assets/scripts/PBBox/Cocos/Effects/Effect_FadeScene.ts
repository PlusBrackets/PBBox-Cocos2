
const { ccclass, property, requireComponent, menu } = cc._decorator;

/**屏幕转场 */
@ccclass @menu("PBBox/Effects/FadeScreen")
export class UItem_FadeScreen extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;
    @property
    fadeInAnim: string = "ScreenFadeIn";
    @property
    fadeOutAnim: string = "ScreenFadeOut";
    @property
    fadeInOnStart: boolean = true;

    onComplete: Function = null;
    thisArg: any = null;

    private fadeNode:cc.Node;

    onLoad() {
        this.node.active = this.fadeInOnStart;
        this.fadeNode = this.anim.node;
        if(cc.winSize.width>this.fadeNode.width)
        this.fadeNode.width = cc.winSize.width;
        if (this.fadeInOnStart)
            this.FadeIn();
    }

    FadeIn(onComplete?: Function, thisArg?: any) {
        this.PlayAnim(this.fadeInAnim, onComplete, thisArg, false);
    }

    FadeOut(onComplete?: Function, thisArg?: any) {
        this.PlayAnim(this.fadeOutAnim, onComplete, thisArg, true);
    }

    private PlayAnim(animName: string, onComplete: Function, thisArg: any, endActive: boolean) {
        if (!!this.onComplete)
            this.onComplete.call(this.thisArg);
        this.onComplete = onComplete;
        this.thisArg = thisArg;
        this.node.active = true;
        let state = this.anim.play(animName);
        this.scheduleOnce(() => {
            if (!!this.onComplete)
                this.onComplete.call(this.thisArg);
            this.onComplete = null;
            this.thisArg = null;
            this.node.active = endActive;
        }, state.duration);
    }
}