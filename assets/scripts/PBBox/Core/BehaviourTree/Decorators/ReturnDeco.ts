import { Decorator } from "../ParentTask";
import { Task, TaskStatus } from "../Task";

/**
 * 当子节点执行完毕时总是返回failure的修饰
 */
export class ReturnFailureDeco extends Decorator {
    /**
    * 当子节点执行完毕时总是返回failure的修饰
    */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    Decorate(status: TaskStatus) {
        if (status === TaskStatus.Success)
            return TaskStatus.Failure;
        return status;
    }
}

/**
 * 当子节点执行完毕时总是返回Success的修饰
 */
export class ReturnSuccessDeco extends Decorator {
    /**
    * 当子节点执行完毕时总是返回failure的修饰
    */
    constructor(replaceProp?: any) {
        super(replaceProp);
    }

    Decorate(status: TaskStatus) {
        if (status === TaskStatus.Failure)
            return TaskStatus.Success;
        return status;
    }
}