import { Composite } from "../ParentTask";
import { Task, TaskStatus } from "../Task";

/**
 * 平行队列，类似与sequence，但并不是一个个执行而是一起执行子task。
 * 若所有子节点都返回了success，则该节点返回success；
 * 若其中一个子节点返回了failure，则该节点停止其他正在运行的节点并返回failure
 */
export default class Parallel extends Composite {
    private currentIndex: number = 0;
    private executionStatus!: Array<TaskStatus>;
    /**
     * 平行队列，类似与sequence，但并不是一个个执行而是一起执行子task。
     * 若所有子节点都返回了success，则该节点返回success；
     * 若其中一个子节点返回了failure，则该节点停止其他正在运行的节点并返回failure
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnAwake() {
        this.executionStatus = new Array<TaskStatus>(this.children.length);
    }

    OnAddChild(index:number) {
        this.executionStatus.push(TaskStatus.Inactive);
    }

    OnChildStarted(index: number) {
        this.currentIndex++;
        this.executionStatus[index] = TaskStatus.Running;
    }

    CanRunParallelChidren() {
        return true;
    }

    CurrentChildIndex() {
        return this.currentIndex;
    }

    CanExecute() {
        return this.currentIndex < this.children.length;
    }

    OnChildExecuted(index: number, status: TaskStatus) {
        this.executionStatus[index] = status;
    }

    OverrideStatus(status: TaskStatus): TaskStatus {
        let isComplete = true;
        this.executionStatus.forEach(_status => {
            if (_status === TaskStatus.Running) {
                isComplete = false;
            }
            else if (_status === TaskStatus.Failure) {
                return TaskStatus.Failure;
            }
        });
        return isComplete ? TaskStatus.Success : TaskStatus.Running;
    }

    OnEnd() {
        for (let i = 0; i < this.executionStatus.length; i++) {
            this.executionStatus[i] = TaskStatus.Inactive;
        }
        this.currentIndex = 0;
    }
}