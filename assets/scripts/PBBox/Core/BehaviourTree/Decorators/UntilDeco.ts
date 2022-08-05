import { Decorator } from "../ParentTask";
import { TaskStatus } from "../Task";

/**
 * 直到子节点返回success为止一直执行
 */
export class UntilSuccessDeco extends Decorator {
    /**
     * 直到子节点返回success为止一直执行
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    CanExecute() {
        return this.executionStatus === TaskStatus.Failure || this.executionStatus === TaskStatus.Inactive;
    }
}

/**
 * 直到子节点返回failure为止一直执行
 */
export class UntilFailureDeco extends Decorator {
    /**
     * 直到子节点返回failure为止一直执行
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
    }

    CanExecute() {
        return this.executionStatus === TaskStatus.Success || this.executionStatus === TaskStatus.Inactive;
    }
}
