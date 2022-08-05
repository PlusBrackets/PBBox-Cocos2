let isOverrided = false;

const InitTimeScaleOverride = () => {
    if (isOverrided)
        return;
    isOverrided = true;
    let scheduler: cc.Scheduler = cc.director["_scheduler"];
    let schedulerUpdateFunc = scheduler.update;
    scheduler.update = function (dt: number) {
        schedulerUpdateFunc.call(scheduler, this._timeScale === 0 ? 0 : dt / this._timeScale);
    }
    let _deltaTime: number = 0;
    let timeScaleAttibute = cc.js.getPropertyDescriptor(cc.director, "_deltaTime");
    Object.defineProperty(cc.director, "_deltaTime", {
        get: () => {
            let r = _deltaTime * cc.director.getScheduler().getTimeScale();

            return r;
        },
        set: (value) => {
            _deltaTime = value;
        },
        enumerable: true,
        configurable: true
    });
}


/**游戏世界时间管理,初始时间将在第一次调用后开始，建议在游戏开始时触发 */
export class TimeManager {
    private static _instance: TimeManager = null;
    static get instance() {
        if (!!!this._instance)
            this._instance = new TimeManager();
        return this._instance;
    }

    static set timeScale(value) {
        this.instance._Init();
        cc.director.getScheduler().setTimeScale(value);
    }

    static get timeScale() {
        this.instance._Init();
        return cc.director.getScheduler().getTimeScale();
    }

    /**游戏世界经过时间,单位是s */
    static get gameTotalTime(): number {
        return this.instance._totalTime;
    }

    private _totalTime: number = 0;

    private constructor() {
        InitTimeScaleOverride();
        let s = cc.director.getScheduler();
        s.enableForTarget(this);
        s.scheduleUpdate(this, -100, false);
    }

    private _Init() { }

    private update(dt) {
        this._totalTime = this._totalTime + dt;
    }

}

/**受TimeManager时间缩放影响的计时器 */
export class GameTimer {
    /**开始时刻(s) */
    startTime: number = 0;
    /**持续时间(s) */
    duration: number = 0;

    /**经过时间(s) */
    get passTime(): number {
        return TimeManager.gameTotalTime - this.startTime;
    }

    /**倒计时(s) */
    get countdown(): number {
        return this.duration - this.passTime;
    }

    /**进度 */
    get progress(): number {
        if (this.duration > 0)
            return this.passTime / this.duration;
        return 1;
    }

    /**是否结束 */
    get isOver(): boolean {
        return this.countdown <= 0;
    }

    /**开始(s) */
    Start(duration: number) {
        this.startTime = TimeManager.gameTotalTime;
        this.duration = duration;
    }

    /**结束 */
    Stop() {
        this.startTime = 0;
        this.duration = 0;
    }
}


/**受TimeManager时间缩放影响的可暂停的计时器 */
export class GamePausableTimer extends GameTimer {
    private pauseTime: number = -1;

    get isPause() {
        return this.pauseTime >= 0
    }

    get passTime(): number {
        if (this.isPause)
            return this.pauseTime - this.startTime;
        else
            return TimeManager.gameTotalTime - this.startTime;
    }

    Pause() {
        if (!this.isPause) {
            this.pauseTime = TimeManager.gameTotalTime;
        }
    }

    Resume() {
        if (this.isPause) {
            this.startTime += TimeManager.gameTotalTime - this.pauseTime;
            this.pauseTime = -1;
        }
    }

    Start(duration: number) {
        super.Start(duration);
        this.pauseTime = -1;
    }

    Stop() {
        super.Stop();
        this.pauseTime = -1;
    }
}