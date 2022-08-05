import { PBUtils } from "../../Tools/PBUtils";
import ShareValue from "../ShareValue";
import ShareVariables from "../ShareVariables";
import { Action, TaskStatus } from "../Task";

/**
 * 设置一个值到ShareVariable中
 */
export default class SetVariableAction extends Action {

    value = ShareValue.Value(1);
    isRandom = ShareValue.Value(false);
    valueMin = ShareValue.Value(1);
    valueMax = ShareValue.Value(1);
    isGlobal = false;
    variableName = "value";

    private setValue: any;

    /**
    * 设置一个值到ShareVaribale中
    *
    * Proportys：{
    * 
    *  variableName:"value" //值名称
    * 
    *  value : ShareValue.Value(1) /,
    * 
    *  isRandom : ShareValue.Value(false) //是否随机
    * 
    *  valueMin : ShareValue.Value(1) //若随机，则取为min
    * 
    *  valueMax : ShareValue.Value(1) //若随机，则取为max 
    * 
    *  isGlobal : false //是否放入ShareVariable.global中
    * 
    *  }
    */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnStart() {
        if (this.isRandom.GetValue(this))
            this.setValue = PBUtils.Random_Range(this.valueMin.GetValue(this), this.valueMax.GetValue(this));
        else
            this.setValue = this.value.GetValue(this);
    }

    OnUpdate(): TaskStatus {
        if (this.isGlobal)
            ShareVariables.Set(this.variableName, this.setValue);
        else
            this.GetOwner().GetVariable().Set(this.variableName, this.setValue);
        return TaskStatus.Success;
    }

}