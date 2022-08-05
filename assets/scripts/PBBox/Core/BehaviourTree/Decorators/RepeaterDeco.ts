import { Decorator } from "../ParentTask";
import ShareValue from "../ShareValue";
import { TaskStatus } from "../Task";

/**
 * 重复执行
 * }
 */
export default class RepeaterDeco extends Decorator {

    private executeTimes: number = 0;

    count: ShareValue = ShareValue.Value(1);
    endOnFailure: ShareValue = ShareValue.Value(false);
    
    /**
     * 重复执行
     * 
     * Property{
     * 
     * count : ShareValue.Value(1) //重复的次数,-1时无限重复
     * 
     * endOnFailure : ShareValue.Value(false) //失败时是否直接中断重复并返回Failure
     * 
     * }
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    CanExecute() {
        let _count: number = this.count.GetValue(this);
        let _endFailure: boolean = this.endOnFailure.GetValue(this);
        return (_count === -1 || this.executeTimes < _count)
            && (!_endFailure || (_endFailure && this.executionStatus !== TaskStatus.Failure))
    }

    OnChildExecuted(index: number, status: TaskStatus) {
        super.OnChildExecuted(index, status);
        this.executeTimes++;
    }

    OnEnd() {
        super.OnEnd();
        this.executeTimes = 0;
    }
}