
// import { director, macro, math, Vec3 ,_decorator, Component, CurveRange,Node} from 'cc';
import { EventManager } from '../../Core/Tools/EventManager';
const { ccclass, property, menu } = cc._decorator;

@ccclass("MotionShakeData")
export class MotionShakeData {
    @property()
    enableShake = false;
    @property({ type: cc.CurveRange, tooltip: "振频" })
    shakeFrequency: cc.CurveRange = new cc.CurveRange();
    @property({ type: cc.CurveRange, tooltip: "振幅" })
    shakeAmplitude: cc.CurveRange = new cc.CurveRange();
    @property()
    phase: number = 0;
}

@ccclass @menu("PBBox/Motions/Shaker")
export class Motion_Shaker extends cc.Component {
    @property(MotionShakeData)
    XShakeData: MotionShakeData = new MotionShakeData;
    @property(MotionShakeData)
    YShakeData: MotionShakeData = new MotionShakeData;
    @property(MotionShakeData)
    ZShakeData: MotionShakeData = new MotionShakeData;
    @property({ tooltip: "1单位的震幅对应的多少像素" })
    unitRatio: number = 1;
    private passTime = 0;
    private duration = 0;
    frequecyMut: cc.Vec3 = new cc.Vec3(1, 1, 1);
    amplityudeMut: cc.Vec3 = new cc.Vec3(1, 1, 1);
    private shakeOffset = new cc.Vec3();
    private shakedPos = new cc.Vec3();
    @property({type:cc.Node,tooltip:"震动的目标，若为空则取自身node"})
    private target:cc.Node = null as any;

    @property({ tooltip: "响应EventManager.Global发送的事件名" })
    private triggerEventName: string = "";
    @property
    private shakeOnLoad = false;
    @property
    private shakeOnLoadDuration = 0;

    onLoad(){
        !this.target&&(this.target = this.node);
    }

    start() {
        if (this.shakeOnLoad) {
            this.Shake(this.shakeOnLoadDuration);
        }
        if (this.triggerEventName) {
            EventManager.global.On(this.triggerEventName, this.Shake, this);
        }
    }

    onDestroy() {
        if (this.triggerEventName) {
            EventManager.global.Off(this.triggerEventName, this.Shake, this);
        }
    }

    Shake(duration: number, amplityudeMut?: cc.Vec3, frequencyMut?: cc.Vec3) {
        this.duration = duration;
        this.passTime = 0;
        this.frequecyMut.set(!!frequencyMut ? frequencyMut : cc.Vec3.ONE);
        this.amplityudeMut.set(!!amplityudeMut ? amplityudeMut : cc.Vec3.ONE);
        this.schedule(this.OnShakeUpdate, 0,cc.macro.REPEAT_FOREVER);
    }

    StopShake() {
        this.unschedule(this.OnShakeUpdate);
    }

    private OnShakeUpdate() {
        const rand = cc['math'].pseudoRandom(cc['math'].randomRangeInt(0, Number.MAX_SAFE_INTEGER));
        this.passTime = cc['math'].clamp(this.passTime + cc.director.getDeltaTime(), 0, this.duration);

        this.target.getPosition(this.shakedPos);
        this.shakedPos.subtract(this.shakeOffset);
        const delta = this.passTime / this.duration;
        this.shakeOffset.x = this.GetShakeOffset(this.passTime, delta, this.XShakeData, rand, this.frequecyMut.x, this.amplityudeMut.x);
        this.shakeOffset.y = this.GetShakeOffset(this.passTime, delta, this.YShakeData, rand, this.frequecyMut.y, this.amplityudeMut.y);
        this.shakeOffset.z = this.GetShakeOffset(this.passTime, delta, this.ZShakeData, rand, this.frequecyMut.z, this.amplityudeMut.z);
        this.shakedPos = this.shakedPos.add(this.shakeOffset);
        this.target.setPosition(this.shakedPos);

        if (this.passTime >= this.duration)
            this.unschedule(this.OnShakeUpdate);
    }

    private GetShakeOffset(time: number, delta: number, shakeData: MotionShakeData, rand: number, mutF: number, mutA: number): number {
        if (!shakeData.enableShake)
            return 0;
        
        let f = shakeData.shakeFrequency['evaluate'](delta, rand) * mutF;
        let a = shakeData.shakeAmplitude['evaluate'](delta, rand) * mutA;
        let offset = a * Math.sin(f * time + shakeData.phase);
        return offset * this.unitRatio;
    }

}