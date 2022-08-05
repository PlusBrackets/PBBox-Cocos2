
import { FXObj } from "./FXObj";

const { ccclass, property, menu } = cc._decorator;

@ccclass @menu("PBBox/FX/VFXObj_Mix")
export class VFXObj_Mix extends FXObj {
    @property([cc.Animation])
    anims: cc.Animation[] = [];
    @property([cc.ParticleSystem])
    psyList: cc.ParticleSystem[] = []
    @property({ tooltip: "如果粒子的duration=-1，且该offset>0。则取为duration" })
    disapearOffset: number = 0;

    OnSpawn(reuseData: any) {
        if (this.anims)
            this.anims.forEach(anim => anim.play());
        if(this.psyList)
            this.psyList.forEach(psy =>psy.resetSystem());
        super.OnSpawn(reuseData);
    }
    
    Recycle() {
        !!this.psyList && this.psyList.forEach(p => p.stopSystem());
        !!this.anims && this.anims.forEach(anim=>anim.stop());
        this.scheduleOnce(super.Recycle, this.disapearOffset);
    }
}