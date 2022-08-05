import ShareValue from "../ShareValue";
import { Conditional, Task, TaskStatus } from "../Task";
/**
 * 随机概率判定
 */
export default class RandomPRCond extends Conditional {
    successPR: ShareValue = ShareValue.Value(0.5);
    /**
     * 随机概率判定
     * 
     * Propertys{
     * 
     *  successPR : ShareValue.Value(0.5) //成功的概率[0,1]
     * 
     * }
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnUpdate(): TaskStatus {
        let _r = Math.random();
        if (_r < (this.successPR.GetValue(this) as any)) {
            return TaskStatus.Success;
        }
        return TaskStatus.Failure;
    }
}