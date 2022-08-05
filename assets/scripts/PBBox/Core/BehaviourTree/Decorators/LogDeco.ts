import BehaviourManager from "../BehaviourManager";
import { Decorator } from "../ParentTask"
import ShareValue from "../ShareValue";
import { TaskStatus } from "../Task";

/**
 * Log子节点执行状态得deco
 * 
 * [tag][name]Status:status;
 * 
 * Propertys：{
 * 
 *  tag:"tag",
 * 
 *  overrideName:"name",
 * 
 *  isLog : ShareValue.Value(true);
 * 
 * }
 */
export default class LogDeco extends Decorator {

    isLog = ShareValue.Value(true);
    tag = "LogDeco";
    overrideName = "";

    /**
     * Log子节点执行状态得deco
     * 
     * [tag][name]Status:status;
     * 
     * Propertys：{
     * 
     *  tag:"tag",
     * 
     *  overrideName:"name",
     * 
     *  isLog : ShareValue.Value(true);
     * 
     * }
     */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnChildStarted() {
        this.Log(TaskStatus.Running);
    }

    Decorate(status: TaskStatus): TaskStatus {
        this.Log(status);
        return status;
    }

    private Log(status: TaskStatus) {
        if (this.isLog.GetValue(this) && BehaviourManager.LogEnable) {
            let _statusStr = "NonStarted";
            switch (status) {
                case TaskStatus.Inactive:
                    _statusStr = "Inactive";
                    break;
                case TaskStatus.Failure:
                    _statusStr = "Failure";
                    break;
                case TaskStatus.Success:
                    _statusStr = "Success";
                    break;
                case TaskStatus.Running:
                    _statusStr = "Running";
                    break;
            }
            console.info("[" + this.tag + "][" + (!!this.overrideName ? this.overrideName : this.children[0].name) + "]" + "Status:" + _statusStr);
        }
    }

}