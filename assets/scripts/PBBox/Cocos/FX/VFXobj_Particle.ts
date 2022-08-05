
import { FXObj } from "./FXObj";

const { ccclass, property, menu } = cc._decorator;

@ccclass @menu("PBBox/FX/VFXObj_Particle")
export class VFXObj_Particle extends FXObj {
    @property(cc.ParticleSystem)
    psys: cc.ParticleSystem = null;
    @property([cc.ParticleSystem])
    psyList: cc.ParticleSystem[] = []
    @property({ tooltip: "如果粒子的duration=-1，且该offset>0。则取为duration" })
    disapearOffset: number = 0;


    GetDuration() {
        let _dur = super.GetDuration();
        if (this.duration < 0)
            return _dur;
        if (!!this.psys)
            return this.psys.duration;
        // if (this.psys.duration >= 0)
        //     _dur = this.psys.duration + this.disapearOffset;
        // else if (this.disapearOffset > 0) {
        //     _dur = this.disapearOffset;
        // }
        // else
        //     return super.GetDuration();
        return _dur;
    }

    // onLoad() {
    //     super.onLoad();
    //     if (!!!this.psys)
    //         this.psys = this.getComponent(cc.ParticleSystem);
    // }

    OnSpawn(reuseData: any) {
        super.OnSpawn(reuseData);
        !!this.psys && this.psys.resetSystem();
        !!this.psyList && this.psyList.forEach(p => p.resetSystem());
    }

    OnDespawn() {
        super.OnDespawn();
        !!this.psys && this.psys.stopSystem();
        !!this.psyList && this.psyList.forEach(p => p.stopSystem());
    }

    Recycle() {
        !!this.psys && this.psys.stopSystem();
        !!this.psyList && this.psyList.forEach(p => p.stopSystem());
        this.scheduleOnce(super.Recycle, this.disapearOffset);
    }
}