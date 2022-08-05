import { ParentTask } from "./ParentTask";
import { Task } from "./Task";

/**综合管理行为树 */
export default class BehaviourManager {
    /**LogAction，LogDeco 等logTask是否打印信息*/
    static LogEnable: boolean = true;

    protected constructor() { }

    /**
     * 从左到右遍历树
     * @param task 根节点
     * @param call (task:Task)=>{}
     * @param thisArg 
     * @param onlyStarted 是否只遍历isStarted的，若为true，则遇到isStarted为false 的task会直接返回不继续遍历其子task，默认为false
     * @param containSelf 是否包含自身，若不包含自身则只遍历其子task,默认为true
     */
    static TraverseTree(task: Task, call: Function, thisArg?: any, onlyStarted: boolean = false, containSelf: boolean = true) {
        if(!!!task)
            return;
        if (containSelf) {
            if (!onlyStarted || task.isStarted) {
                !!thisArg && call.bind(thisArg);
                call(task);
            }
        }
        if (task instanceof ParentTask) {
            task.children.forEach(child => {
                this.TraverseTree(child, call, thisArg, onlyStarted, true);
            });
        }
    }

    /**
     * 遍历已经started的树并将其EndTask
     * @param task 
     * @param containSelf 是否包括task自身，默认为true
     */
    static TraverseEnd(task: Task, containSelf: boolean = true) {
        this.TraverseTree(task, (_task: Task) => {
            Task.EndTask(_task);
        }, null, true, containSelf);
    }

    /**
     * 遍历已经started的task并通知Pause
     * @param task 
     * @param paused 是否暂停
     * @param containSelf 是否包括task自身，默认为true
     */
    static TraversePause(task:Task,paused:boolean,containSelf:boolean = true){
        this.TraverseTree(task, (_task: Task) => {
            _task.OnPause(paused);
        }, null, true, containSelf);
    }

    /**
     * 获取TreeEntry下的所有节点
     * @param task 
     * @param containSelf 是否包括task自身，默认为true
     */
    static GetAllTasks(task:Task,containSelf:boolean = true): Array<Task> {
        let _arr = new Array<Task>();
        this.TraverseTree(task,(_task: Task) => {
            _arr.push(_task);
        },null,false,containSelf);
        return _arr;
    }

    /**
     * 获取TreeEntry下的所有执行中的Task
     * @param task 
     * @param containSelf 是否包括task自身，默认为true
     */
    static GetAllStartedTasks(task:Task,containSelf:boolean = true): Array<Task> {
        let _arr = new Array<Task>();
        this.TraverseTree(task,(_task: Task) => {
            if (_task.isStarted)
                _arr.push(_task);
        },null,true,containSelf);
        return _arr;
    }

    
    
}