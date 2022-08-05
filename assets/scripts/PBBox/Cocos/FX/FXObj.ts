import { PBPoolObj } from "../PBPool";
import { PBUtils } from "../../Core/Tools/PBUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass @menu("PBBox/FX/FXObj")
export class FXObj extends PBPoolObj {

    private defaultAngle: number = 0;
    @property({ tooltip: "特效持续时间，经过后自动回收进对象池" })
    duration: number = 1;

    @property
    randomRotation = false;

    protected _defaultSY: number = undefined;
    protected _defaultSX: number = undefined;
    get defaultScaleY() {
        if (!!!this._defaultSY)
            this._defaultSY = this.node.scaleY;
        return this._defaultSY;
    }
    get defaultScaleX() {
        if (!!!this._defaultSX)
            this._defaultSX = this.node.scaleX;
        return this._defaultSX;
    }
    protected _defaultPos: cc.Vec2 = null;
    get defaultPos() {
        if (!!!this._defaultPos) {
            this._defaultPos = cc.Vec2.ZERO;
            this.node.getPosition(this._defaultPos);
        }
        return this._defaultPos;
    }

    // @property([PlaySFXCfg])
    // sfxCfgs:PlaySFXCfg[] = [];
    // @property([cc.AudioClip])
    // sounds: cc.AudioClip[] = [];
    // @property
    // soundLoop = false;
    // @property
    // soundVolume = 1;
    // @property
    // soundDelay = 0;

    onLoad() {
        this.defaultAngle = this.node.angle;
    }
    GetDuration() {
        return this.duration;
    }

    OnSpawn(reuseData: any) {
        this.node.setPosition(this.defaultPos)
        this.node.scaleX = this.defaultScaleX;
        this.node.scaleY = this.defaultScaleY;
        this.node.angle = this.defaultAngle;
        if (!!reuseData) {
            if (!!reuseData.pos)
                this.node.setPosition(reuseData.pos);
            if (!!reuseData.dir) {
                let angle = reuseData.dir.signAngle(cc.Vec2.RIGHT_R) / Math.PI * 180;
                this.node.angle = -angle;
                this.node.right.x > 0 ? this.node.scaleY = this.defaultScaleY : this.node.scaleY = -this.defaultScaleY;
            }
            else if (typeof reuseData.angle === "number") {
                this.node.angle = reuseData.angle;
            }
            else if (!!reuseData.randomRotate || this.randomRotation) {
                this.node.angle = PBUtils.Random_Range(0, 360);
            }
            !!reuseData.scaleX && (this.node.scaleX = reuseData.scaleX)
            !!reuseData.scaleY && (this.node.scaleY = reuseData.scaleY)
            if (!!reuseData.scale) {
                this.node.scaleX *= reuseData.scale;
                this.node.scaleY *= reuseData.scale;
            }
        }
        let duration = this.GetDuration();
        if (duration >= 0)
            this.scheduleOnce(() => this.Recycle(), duration);
        // let sound = PBUtils.Random_ListItem(this.sounds);
        // if (!!sound) {
        //     if (this.soundDelay > 0) {
        //         this.scheduleOnce(() => cc.audioEngine.play(sound, this.soundLoop, this.soundVolume), this.soundDelay);
        //     }
        //     else {
        //         this.scheduleOnce(() => cc.audioEngine.play(sound, this.soundLoop, this.soundVolume), this.soundDelay);
        //     }
        // }
    }

}