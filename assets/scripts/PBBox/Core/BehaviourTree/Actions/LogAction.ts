import BehaviourManager from "../BehaviourManager";
import ShareValue from "../ShareValue";
import { Action, TaskStatus } from "../Task";

/**
 * Log的action
 */
export default class LogAction extends Action {

    tag = "LogAction";
    isLog = ShareValue.Value(true);
    content = "Do Action"

    /**Log的action
     * 
     * [tag][name]Content:Do Action;
     * 
     * Propertys：{
     * 
     *  tag:"tag",
     * 
     *  content:"Do Action",
     * 
     *  name:"name"
     * 
     *  isLog : ShareValue.Value(true)
     * 
     * }
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnUpdate(): TaskStatus {
        this.Log();
        return TaskStatus.Success;
    }

    private Log() {
        if (this.isLog.GetValue(this) && BehaviourManager.LogEnable)
            console.info("[" + this.tag + "][" + !!this.name ? this.name : this.id + "]" + "Content:" + this.content);
    }
}