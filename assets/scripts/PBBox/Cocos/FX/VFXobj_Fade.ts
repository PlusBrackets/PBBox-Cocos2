
import { GameTimer } from "../TimeManager";
import { FXObj } from "./FXObj";

const { ccclass, property, menu } = cc._decorator;

@ccclass @menu("PBBox/FX/VFXObj_Fade")
export class VFXObj_Fade extends FXObj {

    @property
    fadeDelay = 1;
    @property({ range: [0, 255], slide: true })
    alphaFrom = 255;
    @property({ range: [0, 255], slide: true })
    alphaTo = 0;
    @property(cc.Node)
    colorTarget = null;
    @property(cc.Color)
    colorFrom = cc.Color.WHITE;
    @property(cc.Color)
    colorTo = cc.Color.WHITE;

    @property
    fadeInteval = 0;

    fadeTimer = new GameTimer();

    private defaultDur = undefined;
    private defaultDelay = undefined;

    private fadeStart =false;

    GetDuration() {
        return this.fadeDelay + this.duration;
    }

    OnSpawn(reuseData: any) {
        if (!!!this.defaultDur)
            this.defaultDur = this.duration;
        if (!!!this.defaultDelay)
            this.defaultDelay = this.fadeDelay;
        this.duration = this.defaultDur;
        this.fadeDelay = this.defaultDelay;

        let af = this.alphaFrom;
        let at = this.alphaTo;
        let cf = this.colorFrom;
        let ct = this.colorTo;

        if (!!reuseData) {
            !!reuseData.duration && (this.duration = reuseData.duration);
            !!reuseData.fadeDelay && (this.fadeDelay = reuseData.fadeDelay);
            !!reuseData.alphaF &&(af = reuseData.alphaF);
            !!reuseData.alphaT &&(at = reuseData.alphaT);
            !!reuseData.colorF &&(cf = reuseData.colorF);
            !!reuseData.colorT &&(ct = reuseData.colorT);
        }
        super.OnSpawn(reuseData);
        this.node.opacity = af;
        let colorTarget:cc.Node = !!this.colorTarget?this.colorTarget:this.node;
        colorTarget.color = cf;
        this.schedule(() => this.OnFade(af,at,cf,ct), this.fadeInteval,cc.macro.REPEAT_FOREVER, this.fadeDelay);
    }

    OnDespawn() {
        this.fadeStart = false;
        super.OnDespawn();
        this.unschedule(this.OnFade);
    }

    OnFade(af, at, cf, ct) {
        if(!this.fadeStart)
        {    this.fadeTimer.Start(this.duration)
            this.fadeStart = true;
        }
        if (this.fadeTimer.isOver&&this.fadeStart){
            return;
        }
        let t = cc.misc.clamp01(this.fadeTimer.progress);
        let ahpla = cc.misc.lerp(af, at, t);
        this.node.opacity = ahpla;
        let colorTarget = !!this.colorTarget?this.colorTarget:this.node;
        let color = colorTarget.color;
        cc.Color.lerp(color, cf, ct, t);
        colorTarget.color = color;
    }

}