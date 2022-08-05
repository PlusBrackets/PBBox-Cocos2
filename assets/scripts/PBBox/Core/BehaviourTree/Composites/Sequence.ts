import { Composite } from "../ParentTask";
import { TaskStatus } from "../Task";

/**
 * 类似于与运算的队列行为，按顺序单个执行子节点。
 * 当子节点返回Failure时，队列中断并返回Failure，
 * 当子节点返回success时，继续执行下一个节点，直到队列执行完毕，返回success；
 */
export default class Sequence extends Composite {

    private currentIndex: number = 0;
    private executionStatus: TaskStatus = TaskStatus.Inactive;
    /**
     * 类似于与运算的队列行为，按顺序单个执行子节点。
     * 当子节点返回Failure时，队列中断并返回Failure，
     * 当子节点返回success时，继续执行下一个节点，直到队列执行完毕，返回success；
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    CurrentChildIndex() {
        return this.currentIndex;
    }

    CanExecute() {
        return this.currentIndex < this.children.length && this.executionStatus !== TaskStatus.Failure;
    }

    OnChildExecuted(index: number, status: TaskStatus) {
        this.currentIndex++;
        this.executionStatus = status;
    }

    OnEnd() {
        this.currentIndex = 0;
        this.executionStatus = TaskStatus.Inactive;
    }
}