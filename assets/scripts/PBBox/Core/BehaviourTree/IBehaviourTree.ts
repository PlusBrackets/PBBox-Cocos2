import ShareVariables from "./ShareVariables";
import { Task } from "./Task";
import TreeEntry from "./TreeEntry";
// import TreeEntry from "./TreeConnector";

/**
 * 执行行为树的接口
 */
export default interface IBehaviourTree{
    
    /**
     * 是否创建后自动运行行为树
     */
    isEnableOnAwake:boolean;
    /**
     * 在执行结束后是否自动重新运行
     */
    isLoopTree:boolean;
    // SetTree(tree:TreeEntry);
    /**
     * 获取树入口
     */
    GetTreeEntry():TreeEntry;

    /**返回帧时间 单位为s */
    GetDeltaTime():number;

    /**返回当前游戏时间 单位为s */
    GetTime():number;

    /**获取自身 */
    // GetOwner<T extends IBehaviour>():T;

    /**获取自身的ShareVariable */
    GetVariable():ShareVariables;
    
    /**替换行为树 */
    ReplaceTree(task:Task):void;

    /**
     * 开始运行行为树
     */
    StartTree():void;

    /**
     * 中断行为树，会从自动从头开始
     */
    InterruptTree():void;

    /**
     * 暂停或重启行为树
     * @param pause 是否暂停
     */
    PauseTree(paused:boolean):void;

    /**
     * 停止运行行为树，不会自动开始
     */
    StopTree():void;
    
}