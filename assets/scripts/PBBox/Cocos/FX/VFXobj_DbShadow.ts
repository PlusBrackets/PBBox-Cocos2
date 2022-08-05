
import { VFXObj_Fade } from "./VFXobj_Fade";

const { ccclass, property, menu } = cc._decorator;

/**一个龙骨残像 */
@ccclass @menu("PBBox/FX/VFXObj_DbShadow")
export class VFXObj_DbShadow extends VFXObj_Fade {
    @property(dragonBones.ArmatureDisplay)
    dbDisplay: dragonBones.ArmatureDisplay = null;


    OnSpawn(reuseData: any) {
        super.OnSpawn(reuseData);
        let source:dragonBones.ArmatureDisplay = reuseData.dbDisplay;
        if(!!!source)
            return;
        if(this._isOnLoadCalled){
            this.CopyAnim(source);
        }
        else{
            this.scheduleOnce(()=>this.CopyAnim(source),0);
        }
    }

    CopyAnim(source:dragonBones.ArmatureDisplay){
        
        this.dbDisplay.dragonAtlasAsset = source.dragonAtlasAsset;
        this.dbDisplay.dragonAsset = source.dragonAsset;
        this.dbDisplay.armatureName = source.armatureName;
        //this.dbDisplay.playAnimation(source.animationName,-1);
        let sAnimation = (source.armature() as dragonBones.Armature).animation;
        let animtion =  (this.dbDisplay.armature() as dragonBones.Armature).animation;
        animtion.gotoAndStopByTime(sAnimation.lastAnimationName,sAnimation.lastAnimationState.currentTime);
    }

    OnDespawn() {
        super.OnDespawn();
        this.dbDisplay.dragonAsset = null;
        this.dbDisplay.dragonAtlasAsset = null;
        this.dbDisplay.armatureName = null;
    }
}