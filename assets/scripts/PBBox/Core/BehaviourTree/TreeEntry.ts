import BehaviourManager from "./BehaviourManager";
import IBehaviourTree from "./IBehaviourTree";
import { ParentTask } from "./ParentTask";
import { Task, TaskStatus } from "./Task";

/**行为树入口，连接外界进行子树的管理 */
export default class TreeEntry extends ParentTask {

    private _isPause: boolean = false;
    /**是否正在暂停 */
    get isPause() { return this._isPause; }

    /**
     * 是否创建后自动运行行为树
     */
    isEnableOnAwake: boolean = false;
    /**
     * 是否在执行结束后是否自动重新运行
     */
    isRestartOnEnd: boolean = false;

    executionStatus: TaskStatus = TaskStatus.Inactive;

    CanExecute() {
        return this.isRestartOnEnd ||
            (!this.isRestartOnEnd && (this.executionStatus != TaskStatus.Success && this.executionStatus != TaskStatus.Failure))
    }

    OnChildExecuted(index: number, status: TaskStatus) {
        this.executionStatus = status;
    }

    OnPause(paused:boolean) {
        this._isPause = paused;
    }

    OnEnd() {
        this.executionStatus = TaskStatus.Inactive;
    }

    MaxChild() {
        return 1;
    }

    constructor(replaceProp?:any){
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    /**
     * 绑定Behaviour，在AwaikeTree前调用
     * @param behaviour 
     */
    public BindBehaviour(behaviour: IBehaviourTree, isEnableOnAwake: boolean, isLoopTree: boolean) {
        if (!!this.owner) {
            console.error("已经绑定了Behavior，请先解绑");
            return;
        }
        this.isRestartOnEnd = isLoopTree;
        this.isEnableOnAwake = isEnableOnAwake;
        this.owner = behaviour;
    }

    /**
     * 解绑Behaviour
     */
    public UnBindBehaviour() {
        if (!!!this.owner)
            return;
        if (this.isStarted)
            this.StopTree();
        this.owner = null as any;
        // this["_isAwaked"] = false;
        // this.TraverseTree((task:Task)=>{
        //     if(task.isAwaked)
        //         task["_isAwaked"] = false;
        // })
    }

    /**
     * IBehaviour中脚本调用，初始化tree
     */
    public AwakeTree() {
        BehaviourManager.TraverseTree(this, (task: Task) => {
            Task.AwakeTask(task);
        });
        if (this.isEnableOnAwake)
            Task.StartTask(this);
    }

    /**
     * IBehaviour中调用，开始执行Tree
     */
    public StartTree() {
        Task.StartTask(this);
    }

    /**
     * IBehaviour中脚本调用,对接每帧更新。如果tree完成则返回false
     */
    public Tick(): boolean {
        if (!this.isStarted)
            return false;
        if (this.isPause)
            return true;
        if(!!!this.child)
            return true;
        let _isEnd = Task.UpdateTask(this) != TaskStatus.Running;
        return !_isEnd;
        // return _status != TaskStatus.Running;
    }

    /**
     * IBehaviour中脚本调用，暂停行为树
     * @param paused 是否暂停
     */
    public PauseTree(paused: boolean) {
        if (!this.isStarted)
            return;
        BehaviourManager.TraversePause(this, paused);
    }

    /**
     * IBehaviour中脚本调用，中断整棵树
     */
    public InterruptTree(reStart: boolean = true) {

        //中止正在运行中的task
        BehaviourManager.TraverseEnd(this);

        if (reStart) {
            this.StartTree();
        }
        else
            this._isPause = false;
    }

    /**
     * IBehaviour中调用，停止树
     */
    public StopTree() {
        this.InterruptTree(false);
    }

    //#region util func


    //#endregion

}