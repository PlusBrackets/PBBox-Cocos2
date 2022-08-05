import { PBUtils } from "../../Tools/PBUtils";
import ShareValue from "../ShareValue";
import { Action, TaskStatus } from "../Task";

/**
 * 等待一段时间的Action
 */
export default class WaitAciton extends Action {

    waitTime = ShareValue.Value(1);
    isRandom = ShareValue.Value(false);
    waitMin = ShareValue.Value(1);
    waitMax = ShareValue.Value(1);
    /**
     * 是否使用现实时间
     */
    useRealTime = ShareValue.Value(false);

    private startTime: number = 0;
    private pauseTime: number = 0;
    private waitDuration: number = 1;
    /**
 * 等待一段时间的Action
 *
 * Proportys：{
 * 
 *  waitTime : ShareValue.Value(1) //等待时间,
 * 
 *  isRandom : ShareValue.Value(false) //是否随机
 * 
 *  waitMin : ShareValue.Value(1) //若随机，则取为min
 * 
 *  waitMax : ShareValue.Value(1) //若随机，则取为max 
 * 
 *  userRealTime : ShareValue.Value(false) //是否使用现实时间
 * 
 * }
 */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnStart() {
        this.startTime = this.GetTime();
        if (this.isRandom.GetValue(this)) {
            this.waitDuration = PBUtils.Random_Range(this.waitMin.GetValue(this), this.waitMax.GetValue(this))
        }
        else {
            this.waitDuration = this.waitTime.GetValue(this);
        }
    }

    OnUpdate(): TaskStatus {
        if (this.startTime + this.waitDuration < this.GetTime()) {
            return TaskStatus.Success;
        }
        return TaskStatus.Running;
    }

    OnPause(paused: boolean) {
        if (paused) {
            this.pauseTime = this.GetTime();
        }
        else {
            this.startTime += (this.GetTime() - this.pauseTime);
        }
    }

    private GetTime(): number {
        if (!this.useRealTime.GetValue(this))
            return this.GetOwner().GetTime();
        else
            return Date.now() / 1000;
    }
}