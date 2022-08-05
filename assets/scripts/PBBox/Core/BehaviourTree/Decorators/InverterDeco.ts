import { Decorator } from "../ParentTask";
import { TaskStatus } from "../Task";
/**
 * 取反修饰，“！childStatus”
 */
export default class InverterDeco extends Decorator {
    /**
     * 取反修饰，“！childStatus”
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    Decorate(status: TaskStatus) {
        if (status == TaskStatus.Failure)
            return TaskStatus.Success;
        else if (status == TaskStatus.Success)
            return TaskStatus.Failure;
        return status;
    }
}