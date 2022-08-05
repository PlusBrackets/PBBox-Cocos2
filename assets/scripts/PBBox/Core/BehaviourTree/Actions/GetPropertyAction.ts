import ShareValue from "../ShareValue";
import ShareVariables from "../ShareVariables";
import { Action, TaskStatus } from "../Task";

/** 从目标中获取值存放到shareVariable中 */
export default class GetPropertyAction extends Action {
    toGlobal = false;
    saveName!: string;
    fromObj!: ShareValue;
    propName = "value";

    /**
        * 从目标中获取值存放到shareVariable中,若操作成功，返回Success，否则返回Failure
        * 
        * Propertys{
        * 
        *  toGlobal : false //是否放到ShareVariable.global中
        * 
        *  saveName:null //存放时的名称,若为空，则使用propName
        *
        *  fromObj:ShareValue.Value(obj) //取值的对象
        * 
        *  propName:"value" //属性名称
        * 
        * }
        */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
        if (!this.saveName)
            this.saveName = this.propName;
    }

    OnUpdate() {
        let obj:any = this.fromObj.GetValue(this);
        if (!obj)
            return TaskStatus.Failure;
        if (!obj[this.propName])
            return TaskStatus.Failure;
        if (this.toGlobal) {
            ShareVariables.Set(this.saveName, obj[this.propName]);
        }
        else {
            this.GetOwner().GetVariable().Set(this.saveName, obj[this.propName]);
        }
        return TaskStatus.Success;
    }

}