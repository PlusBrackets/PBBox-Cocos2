import IBehaviourTree from "./IBehaviourTree";
import { Task, TaskStatus } from "./Task";
import BehaviourManager from "./BehaviourManager";

export abstract class ParentTask extends Task {
    protected _children: Array<Task> = new Array<Task>();
    /**子节点列表 */
    public get children() {
        return this._children;
    }

    /**children[0] */
    public get child() {
        if (this.children.length > 0)
            return this.children[0];
        else return null;
    }

    OnSetOwner(value: IBehaviourTree) {
        //设置子节点的Owner
        if (!!this._children) {
            this._children.forEach(child => {
                child.owner = this._owner;
            });
        }
    }
    // private _updateIndex: Array<number> = new Array<number>();

    OnUpdate(): TaskStatus {
        //start child
        let _status: TaskStatus = TaskStatus.Success;
        // let canExec = true;
        // if (canExec) {
        //     let _index = this.CurrentChildIndex();
        //     let _c = this.children[_index];
        //     //若触发Task的Start，则调用OnChildStarted
        //     if (Task.StartTask(_c))
        //         this.OnChildStarted(_index);
        //     _status = Task.UpdateTask(_c);
        //     if (_status == TaskStatus.Success || _status === TaskStatus.Failure) {
        //         Task.EndTask(_c);
        //         this.OnChildExecuted(_index, _status);
        //         _status = this.Decorate(_status);
        //     }
        // }
        let _canParallel = this.CanRunParallelChidren();
        let _index = 0;
        //
        do {
            if (!this.CanExecute())
                break;
            _index = this.CurrentChildIndex();
            let _task = this.children[_index];
            if (Task.StartTask(_task))
                this.OnChildStarted(_index);
        }
        //若可以平行运行则将循环执行致CanExecute为false
        while (_canParallel);

        //UpdateChild
        if (_canParallel) {
            for (let i = 0; i < this.children.length; i++) {
                _status = this.UpdateATask(i);
            }
        }
        else {
            _status = this.UpdateATask(_index);
        }

        // //若可以执行且可以并行执行则触发循环
        // while (canExec && this.CanRunParallelChidren());
        if (!this.CanExecute()) {
            _status = this.OverrideStatus(_status);
            if (_canParallel && _status != TaskStatus.Running) {
                //当平行运行时结束该节点，则中止已经started的子树
                BehaviourManager.TraverseEnd(this, false);
            }
            return _status;
        }
        else
            return TaskStatus.Running;
    }

    private UpdateATask(index: number): TaskStatus {
        let _task = this.children[index];
        if(!!!_task)
            return TaskStatus.Success;
        let _status = Task.UpdateTask(_task);
        if (_status == TaskStatus.Success || _status === TaskStatus.Failure) {
            if (Task.EndTask(_task)) {
                this.OnChildExecuted(index, _status);
                _status = this.Decorate(_status);
            }
        }
        return _status;
    }

    /**
     * 添加一队task
     * @param tasks 
     */
    AddChilds(tasks: Task[]): ParentTask {
        for (let i = 0; i < tasks.length; i++) {
            this.AddChild(tasks[i]);
        }
        return this;
    }

    /**添加一个Child */
    AddChild(task: Task): ParentTask|null {
        if (!!!task) {
            //添加的task不能为空
            return null;
        }
        if (this.children.length >= this.MaxChild()) {
            console.warn(task + "[ID=" + task.id + "]以达到最大child数量");
            return null;
        }
        if (this._children.indexOf(task) >= 0) {
            console.warn("已有相同的Task:" + task + "[ID=" + task.id, "]");
            return null;
        }
        this._children.push(task);
        //若已经在运行中则触发新加child的Awake
        if (!!this.owner)
            task.owner = this.owner;
        if (this.isAwaked) {
            BehaviourManager.TraverseTree(task, (_task: Task) => {
                Task.AwakeTask(_task);
            })
            // Task.AwakeTask(task);
        }
        if (this.isStarted) {
            this.OnAddChild(this.children.length - 1);
        }
        return this;
    }

    /**
     * 当运行中添加了一个child时调用
     * @param index 
     */
    OnAddChild(index: number) { }
 
    /** 
     * 替换非运行状态的child
     * @param index 
     * @param newTask 
     */
    ReplaceChild(index: number, newTask: Task) {
        if (!!!newTask) {
            //添加的task不能为空
            return;
        }
        if (index < 0 || index >= this.children.length) {
            console.warn("index越界，无法替换task");
            return;
        }
        let _replaceTask = this.children[index];

        if (_replaceTask.isStarted) {
            console.warn("替换的task正在运行中，无法替换");
            return;
        }
        this.children[index] = newTask;
        if (!!this.owner)
            newTask.owner = this.owner;
        if (this.isAwaked) {
            BehaviourManager.TraverseTree(newTask, (_task: Task) => {
                Task.AwakeTask(_task);
            })
        }
        _replaceTask.owner = null as any;

    }

    /**最大child数量 */
    MaxChild(): number {
        return Number.MAX_VALUE;
    }

    /**currentChild是否可以被执行（Start） */
    CanExecute(): boolean {
        return true;
    }

    /**是否可以重新评估 */
    CanReevaluate(): boolean {
        return false;
    }

    /**是否平行执行，若为true，则会循环Start行为直到canExecute返回false */
    CanRunParallelChidren(): boolean {
        return false;
    }

    /**当前被执行的Child的index，若parallel为true，则只代表被start的index */
    CurrentChildIndex(): number {
        return 0;
    }

    /**
     * 当child执行结束后调用
     * @param status child返回的status
     */
    Decorate(status: TaskStatus): TaskStatus {
        return status;
    }

    /**
     * 当child执行结束后调用
     * @param childIndex 
     * @param childStatus 
     */
    OnChildExecuted(childIndex: number, childStatus: TaskStatus) { }

    /**
     * 当Child执行Start后调用
     * @param childIndex 
     */
    OnChildStarted(childIndex: number) { }

    /**
     * canExecute为false时OnUpdate返回Status前调用
     * @param status 
     */
    OverrideStatus(status: TaskStatus): TaskStatus {
        return status;
    }
}

export abstract class Composite extends ParentTask {

}

/**
 * 用作修饰child的返回值的Task，默认单个Child节点，并只执行一次
 */
export abstract class Decorator extends ParentTask {

    /**
     * child执行完毕后的status
     */
    protected executionStatus: TaskStatus = TaskStatus.Inactive;

    CanExecute() {
        return this.executionStatus == TaskStatus.Inactive;
    }
    /**
     * 当child执行结束后调用
     * @param childIndex 
     * @param childStatus 。
     * 
     * 需要super来维持executionStatus的更新
     */
    OnChildExecuted(childIndex: number, childStatus: TaskStatus) {
        this.executionStatus = childStatus;
    }

    /**当OnUpdate返回success或failure时，或task结束时触发
     * 
     * 需要super来维持executionStatus的更新
     * */
    OnEnd() {
        this.executionStatus = TaskStatus.Inactive;
    }

    MaxChild(): number {
        return 1;
    }

}
