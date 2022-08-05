import { Action, TaskStatus } from "../Task";

/**
 * 一直返回running状态的Action
 */
export default class IdleAction extends Action {
    /**
     * 一直返回running状态的Action
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnUpdate() {
        return TaskStatus.Running;
    }
}