
import { FXObj } from "./FXObj";

const { ccclass, property, menu } = cc._decorator;

@ccclass @menu("PBBox/FX/VFXObj_Anim")
export class VFXObj_Anim extends FXObj {
    @property(cc.Animation)
    anim: cc.Animation = null;

    duration = 0;

    GetDuration() {
        if (this.duration != 0)
            return super.GetDuration();
        if (!!!this.anim)
            return super.GetDuration();
        if (!!!this.anim.currentClip)
            return super.GetDuration();
        if (this.anim.currentClip.wrapMode != cc.WrapMode.Normal && this.anim.currentClip.wrapMode != cc.WrapMode.Default)
            return -1;
        return this.anim.currentClip.duration;
    }

    onLoad() {
        super.onLoad();
        if (!!!this.anim)
            this.anim = this.getComponent(cc.Animation);
    }

    OnSpawn(reuseData: any) {
        if (!!this.anim)
            this.anim.play();
        super.OnSpawn(reuseData);
    }

    OnDespawn() {
        super.OnDespawn();
        if (!!this.anim)
            this.anim.stop();
    }
}