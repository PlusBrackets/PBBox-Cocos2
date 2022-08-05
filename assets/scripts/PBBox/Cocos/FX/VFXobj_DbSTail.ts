import { PBPools } from "../PBPool";
import { FXObj } from "./FXObj";

const { ccclass, property, menu } = cc._decorator;

/**龙骨残像拖尾 */
@ccclass @menu("PBBox/FX/VFXObj_DbSTail")
export class VFXObj_DbSTail extends FXObj {

    @property(cc.Prefab)
    dbShadow: cc.Prefab = null;
    @property
    shadowInterval = 0.1;

    private dbDisplay: dragonBones.ArmatureDisplay;
    private followNode: cc.Node;
    private shadowPools: PBPools;

    OnSpawn(reuseData: any) {
        super.OnSpawn(reuseData);
        this.dbDisplay = reuseData.dbDisplay;
        if (!!!this.dbDisplay)
            return;
        this.followNode = reuseData.followNode;
        if (!!!this.followNode)
            this.followNode = this.dbDisplay.node;

        this.shadowPools = reuseData.shadowPools;
        if (this.shadowPools && !this.shadowPools.Has(this.dbShadow.name)) {
            this.shadowPools.RegisterObj(this.dbShadow.name, this.dbShadow, 2);
        }
        this.schedule(this.OnTail, this.shadowInterval);
    }

    OnDespawn() {
        super.OnDespawn();
        this.unschedule(this.OnTail);
        this.dbDisplay = null;
        this.shadowPools = null;
    }

    OnTail() {
        let pos: cc.Vec2 = cc.Vec2.ZERO;
        this.dbDisplay.node.parent.convertToWorldSpaceAR(this.dbDisplay.node.getPosition(), pos);
        this.followNode.parent.convertToNodeSpaceAR(pos, pos);
        let scaleX = this.dbDisplay.node.scaleX * this.followNode.scaleX;
        let scaleY = this.dbDisplay.node.scaleY * this.followNode.scaleY;
        let angle = this.dbDisplay.node.angle + this.followNode.angle;
        let vfx = this.shadowPools.GetObj(this.dbShadow.name, this.followNode.parent, { dbDisplay: this.dbDisplay, pos: pos, scaleX: scaleX, scaleY: scaleY, angle: angle });
        vfx.setSiblingIndex(this.followNode.getSiblingIndex());
    }
}