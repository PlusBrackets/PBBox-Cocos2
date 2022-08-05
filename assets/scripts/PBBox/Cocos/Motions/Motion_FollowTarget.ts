import { PBPoolObj } from "../PBPool";

const { ccclass, property, requireComponent, menu } = cc._decorator;

/**屏幕转场 */
@ccclass @menu("PBBox/Motions/FollowTarget")
export default class Motion_FollowTarget extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;
    @property(cc.Vec3)
    PosOffset: cc.Vec3 = cc.Vec3.ZERO
    @property
    followSmooth: number = 10;
    @property
    followOnLoad: boolean = true;

    private canFollow = false;

    private posw: cc.Vec3 = cc.Vec3.ZERO;
    private posl: cc.Vec3 = cc.Vec3.ZERO;
    private lerpPos: cc.Vec3 = cc.Vec3.ZERO;

    start() {
        if (this.followOnLoad)
            this.StartFollow();
    }

    StartFollow(target: cc.Node = null) {
        if (target)
            this.target = target;
        this.canFollow = true;
        this.node.getPosition(this.lerpPos);
    }

    StopFollow(keepTarget: boolean = false) {
        this.canFollow = false;
        if (!keepTarget)
            this.target = null;
    }

    update(dt) {
        this.DoFollow(dt);
    }

    protected DoFollow(dt) {
        if (this.canFollow && this.target) {
            if (this.target.parent === this.node.parent) {
                this.target.getPosition(this.posl);
            }
            else {
                !!this.target.parent ? this.target.parent.convertToWorldSpaceAR(this.target.position, this.posw) : this.target.getPosition(this.posw);
                this.node.parent.convertToNodeSpaceAR(this.posw, this.posl);
            }
            this.posl.addSelf(this.PosOffset);
            let t = Math.max(1, (this.followSmooth * dt));
            cc.Vec3.lerp(this.lerpPos, this.lerpPos, this.posl, t);
            this.node.setPosition(this.lerpPos);
        }
    }
}