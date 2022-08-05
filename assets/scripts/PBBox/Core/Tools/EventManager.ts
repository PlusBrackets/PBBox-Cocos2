/**
 * 事件管理器
 */
export class EventManager {

    private static _global: EventManager;
    static get global() {
        if (this._global == null)
            this._global = new EventManager();
        return this._global;
    }

    events: { [key: string]: Array<{ callBack: Function, thisArg: any }> }

    constructor() {
        this.events = {};
    }

    /**
     * 发送事件
     * @param eventName 
     * @param args 
     */
    Emit(eventName: string, ...args: any) {
        let listener = this.events[eventName];
        !!listener && (listener.forEach(listen => listen.callBack.apply(listen.thisArg, args)))
        return this;
    }

    /**
     * 订阅事件
     * @param eventName 
     * @param callBack 
     * @param thisArg 
     */
    On(eventName: string, callBack: Function, thisArg: any = null) {
        let listener = this.events[eventName] || [];
        !!callBack && listener.push({ callBack: callBack, thisArg: thisArg });
        this.events[eventName] = listener;
        return this;
    }

    /**
     * 订阅一次
     * @param eventName 
     * @param callBack 
     * @param thisArg 
     */
    Once(eventName: string, callBack: Function, thisArg: any = null) {
        var myself = this;
        let decor = (...args: any[]) => {
            !!callBack && callBack.apply(thisArg, args);
            myself.Off(eventName, callBack, thisArg);
        }
        this.On(eventName, decor, thisArg);
        return this;
    }

    /**
    * 取消订阅事件
    * @param eventName 
    * @param callBack 
    * @param thisArg 
    */
    Off(eventName: string, callBack: Function, thisArg: any)
    /**
     * 取消订阅事件
     * @param eventName 
     * @param thisArg 
     */
    Off(eventNmae: string, thisArg: any)
    /**
     * 取消订阅事件
     * @param thisArg 
     */
    Off(thisArg: any)

    Off(arg0: any, arg1?: any, arg2?: any) {
        if (typeof arg0 === "string") {
            let listener = this.events[arg0];
            if (arg1 instanceof Function) {
                !!listener && (this.events[arg0] = listener.filter(listen => listen.callBack != arg1 || listen.thisArg != arg2));
            }
            else {
                !!listener && (this.events[arg0] = listener.filter(listen => listen.thisArg != arg1));
            }
        }
        else {
            for (const k in this.events) {
                if (this.events.hasOwnProperty(k))
                    this.Off(k as string, arg0);
            }
        }
        return this;
    }

    /**
     * 取消指定事件名称的所有事件
     */
    remove(eventName: string) {
        this.events[eventName] = [];
        return this;
    }

    removeAll() {
        this.events = {};
        return this;
    }
}