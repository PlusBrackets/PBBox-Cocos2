import ShareValue from "../ShareValue";
import { Conditional, TaskStatus } from "../Task";

export enum CompareFlag{
    /**== */
    equal = 0b1,
    /**> */
    greater = 0b10,
    /**< */
    smaller = 0b100,
}

/**比较值,若isEqual==true,则返回A>=B，否则返回A>B */
export default class CompareCond extends Conditional {

    valueA = ShareValue.Value(0);
    valueB = ShareValue.Value(0);
    flag = CompareFlag.greater|CompareFlag.equal;

    /**
       * 比较值,若isEqual==true,则返回A>=B，否则返回A>B
       * 
       * Propertys{
       * 
       *  valueA : ShareValue.Value(0) //
       * 
       *  valueB : ShareValue.Value(0) //
       * 
       *  flag = CompareFlag.equal|CompareFlag.greater // A>=B;
       * 
       * }
       */
    constructor(replaceProp?: any) {
        super(replaceProp);
        this.ReplacePropertys(replaceProp);
    }

    OnUpdate():TaskStatus{
        let check = false;
        let a:any = this.valueA.GetValue(this);
        let b:any = this.valueB.GetValue(this);
        if((this.flag&CompareFlag.equal) == CompareFlag.equal){
            check = a==b;
        }
        if(!check){
            if((this.flag&CompareFlag.greater) == CompareFlag.greater){
                check = a>b;
            }
            else if((this.flag&CompareFlag.smaller) == CompareFlag.smaller){
                check = a<b;
            }
        }
        return (check ? TaskStatus.Success : TaskStatus.Failure);
    }
}
