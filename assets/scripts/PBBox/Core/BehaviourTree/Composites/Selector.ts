import { Composite } from "../ParentTask";
import { Task, TaskStatus } from "../Task";

/**类似或运算的选择行为。
 * 若子节点返回success，则该节点返回success。
 * 若子节点返回failure，则该节点执行下一个子节点，若直到执行完毕都没有子节点返回success，则该节点返回failure
 **/
export default class Selector extends Composite {
    private currentIndex: number = 0;
    private executionStatus: TaskStatus = TaskStatus.Inactive;
    /**类似或运算的选择行为。
     * 若子节点返回success，则该节点返回success。
     * 若子节点返回failure，则该节点执行下一个子节点，若直到执行完毕都没有子节点返回success，则该节点返回failure
     **/
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    CurrentChildIndex() {
        return this.currentIndex;
    }

    CanExecute() {
        return this.currentIndex < this.children.length && this.executionStatus != TaskStatus.Success;
    }

    OnChildExecuted(index: number, childStatus: TaskStatus) {
        this.currentIndex++;
        this.executionStatus = childStatus;
    }

    OnEnd() {
        this.executionStatus = TaskStatus.Inactive;
        this.currentIndex = 0;
    }
}