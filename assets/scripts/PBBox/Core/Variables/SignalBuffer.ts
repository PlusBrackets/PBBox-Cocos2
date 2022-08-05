/**
 * 信号组
 */
export class SignalBufferGroup {
    private signals: Array<SignalBuffer>;

    constructor() {
        this.signals = new Array<SignalBuffer>();
    }

    Add(signal: SignalBuffer) {
        if (this.signals.indexOf(signal) >= 0)
            return;
        this.signals.push(signal);
    }

    Remove(signal: SignalBuffer) {
        let _index = this.signals.indexOf(signal);
        if (_index >= 0) {
            this.signals.splice(_index, 1);
        }
    }

    ApplyExcept(signal: SignalBuffer) {
        this.signals.forEach(s => {
            if (s !== signal)
                s.Apply();
        });
    }
}

/**
 * 值缓存,可以设置经过多长时间重置
 */
export class ValueBuffer<T> {

    protected bufferValue: T;
    /**
     * 值的缓存时间，若大于0，则经过bufferTime的秒数后自动清除信号
     */
    bufferTime: number = -1;

    protected inputTime: number = 0;
    protected defalutValue: T;

    /**
     * 值缓存,可以设置经过多长时间归0
     * @param bufferTime 缓存的时间，<=0时为无缓存时间
     * @param group 
     */
    constructor(bufferTime: number = 0, defaultValue?: T) {
        this.bufferTime = bufferTime;
        this.bufferValue = defaultValue as T;
        this.defalutValue = defaultValue as T;
    }

    /**
     * 设置值，同时更新倒计时
     */
    SetValue(value: T) {
        this.bufferValue = value;
        this.inputTime = Date.now();
    }

    /**
     * 检测是否有信号，使用后信号不会自动归0
     */
    Check(): T {
        if (this.bufferValue !== this.defalutValue) {
            //检测是否超时
            if (this.bufferTime > 0 && (
                this.bufferTime * 1000 < (Date.now() - this.inputTime)
            )) {
                this.bufferValue = this.defalutValue;
            }
        }
        return this.bufferValue;
    }

    /**
     * 使用信号，返回是否有信号，使用后信号归0
     */
    Apply(): T {
        let _s = this.Check();
        this.bufferValue = this.defalutValue;
        return _s;
    }
}


/**
 * 信号缓存,可以设置经过多长时间归0
 */
export class SignalBuffer extends ValueBuffer<boolean> {

    private _group!: SignalBufferGroup;
    get group() { return this._group; }
    set group(value) {
        if (!!this._group)
            this._group.Remove(this);
        this._group = value;
        this._group.Add(this);
    }

    /**
     * 信号缓存,可以设置经过多长时间归0
     * @param bufferTime 缓存的时间，<=0时为无缓存时间
     * @param group 
     */
    constructor(bufferTime: number = 0, group?: SignalBufferGroup) {
        super(bufferTime,false);
        this.group = group as SignalBufferGroup;
    }

    /**
     * 触发信号
     */
    Trigger() {
        if (!!this.group) {
            this.group.ApplyExcept(this);
        }
        this.SetValue(true);
    }

}
