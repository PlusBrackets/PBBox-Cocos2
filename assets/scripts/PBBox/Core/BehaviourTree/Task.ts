// namespace PBBox.BehaviourTree{
// }
import IBehaviourTree from "./IBehaviourTree";
import ShareValue from "./ShareValue";
import ShareVariables from "./ShareVariables";

/**
 * 任务状态
 */
export enum TaskStatus {
    /**Task未开始 */
    NonStarted = -1,
    Inactive = 0,
    Failure = 1,
    Success = 2,
    Running = 3
}

/**
 * 行为树基础任务
 * 生命周期：
 * OnAwake -> loop(if start Task){OnStart -> loop{OnUpdate} -> OnEnd}
 */
export abstract class Task {
    //id基址，创建id时ID_BASE++
    private static ID_BASE = 0;
    // /**当前行为树入口 */
    // protected _tree: TreeConnector = null;
    // /**当前行为树入口 */
    // get tree(): TreeConnector {
    //     return this._tree;
    // }
    // /**当前行为树入口 */
    // set tree(value: TreeConnector) {
    //     this._tree = value;
    // }
    protected _owner: IBehaviourTree = null as any;
    /**执行该行为树的脚本 */
    get owner(): IBehaviourTree {
        return this._owner;
    }
    /** 执行该行为树的脚本，当有变化时会调用OnOwnerChanged*/
    set owner(value: IBehaviourTree) {
        if (this._owner != value) {
            if (!!this._owner)
                this.OnBeihaviourUnbind();
            this._owner = value;
            if (!!this._owner)
                this.OnBeihaviourBind();
            this.OnSetOwner(value);
        }
    }
    private _id: number = -1;
    /**唯一标识，创建时自动生成 */
    get id() {
        return this._id;
    }
    //Task的名称，用于标识task
    name: string = "";
    //parent: Task;
    /**属性数据 */
    // propertys: any;
    private _isAwaked: boolean = false;
    /**Task是否已经awake */
    get isAwaked() {
        return this._isAwaked;
    }
    private _isStarted: boolean = false;
    /**Task是否已经开始 */
    get isStarted() {
        return this._isStarted;
    }

    /**
     * 构造函数
     * @param replacePropertys 若为string，则定义为name，否则则属于传入属性，传入的属性会赋值到propertys中，当属性名为name时则会被替换到this.name中,
     * 例如{ name:"ABC",prop1:"test"},name设置为this.name，prop1则设置到this.prop1中
     * 
     * 必须重写构造函数并调用ReplacePropertys
     */
    constructor(replacePropertys?: any) {
        this._id = Task.ID_BASE++;
        // this.ReplacePropertys(replacePropertys);
    }

    // /**在此处设置初始可从构造函数中传入的property*/
    // protected DefaultPropertys(): any {
    //     return {};
    // }

    protected ReplacePropertys(replacePropertys: any) {
        if (!!replacePropertys) {
            if (typeof replacePropertys === "string") {
                this.name = replacePropertys;
            }
            // if (!!!this.propertys)
            //     this.propertys = {};
            //初始化可输入property
            // this.propertys = this.DefaultPropertys();
            //更新外部输入属性
            else {
                let self:any = this;
                let pNames: string[] = Object.getOwnPropertyNames(replacePropertys)
                // console.warn("!!!!!!!!!!!!!!!" + Object.getOwnPropertyNames(self).toString() + "\n" + pNames.toString());
                pNames.forEach(pname => {
                    if (!(replacePropertys[pname] instanceof ShareValue) && (self[pname] instanceof ShareValue))
                        self[pname] = ShareValue.Value(replacePropertys[pname]);
                    else
                        self[pname] = replacePropertys[pname];
                });
            }
        }
    }

    protected OnSetOwner(value: IBehaviourTree) { }

    /**
     * 获取当前行为树的运行behaviour
     */
    GetOwner<T extends IBehaviourTree>(): T {
        return this.owner as T;
    }

    /**设置ShareVariable */
    protected SetVariable(name: string, value: any, global: boolean = false) {
        if (global)
            ShareVariables.Set(name, value);
        else
            this.GetOwner().GetVariable().Set(name, value);
    }

    /**获取ShareVariable */
    protected GetVariable<T>(name: string, global: boolean = false): T {
        let value;
        if (global)
            value = ShareVariables.Get(name);
        else
            value = this.GetOwner().GetVariable().Get(name);
        return value as T;
    }

    /*** 当对接IBeihaviour时调用*/
    OnBeihaviourBind() { }
    /**当脱离IBeihaviour时调用 */
    OnBeihaviourUnbind() { }

    //#region virtual func
    /**Task初始化时触发 */
    OnAwake() { };

    /**开始Task触发 */
    OnStart() { };

    OnUpdate(): TaskStatus { return TaskStatus.Success };

    OnConditionalAbort() { };

    /**当OnUpdate返回success或failure时，或task结束时触发*/
    OnEnd() { };

    /**当暂停时调用 */
    OnPause(paused: boolean) { };

    //#region static func
    /**AwakeTask,若已经awake过则不会执行OnAwake，并返回false */
    public static AwakeTask(task: Task): boolean {
        if (task._isAwaked)
            return false;
        task.OnAwake();
        task._isAwaked = true;
        return true;
    }

    /**开始Start，若未awake或已经start过则不会执行OnStart，并返回false */
    public static StartTask(task: Task): boolean {
        if (task._isStarted || !task._isAwaked)
            return false;
        task.OnStart();
        task._isStarted = true;
        return true;
    }

    /** 更新Task，若未start则不会执行，且返回inactive*/
    public static UpdateTask(task: Task): TaskStatus {
        if (!task._isStarted)
            return TaskStatus.NonStarted;
        return task.OnUpdate();
    }

    /**结束task，若未开始的task则不会执行onEnd，并返回false */
    public static EndTask(task: Task): boolean {
        if (!task._isStarted)
            return false
        task.OnEnd();
        task._isStarted = false;
        return true;
    }
    //#endregion
}

export abstract class Action extends Task {

}

export abstract class Conditional extends Task {

}

