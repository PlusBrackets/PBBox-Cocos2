// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import IBehaviourTree from "../Core/BehaviourTree/IBehaviourTree";
import ShareVariables from "../Core/BehaviourTree/ShareVariables";
import { Task } from "../Core/BehaviourTree/Task";
import TreeEntry from "../Core/BehaviourTree/TreeEntry";
import { TimeManager } from "./TimeManager";

const { property } = cc._decorator;

/**
 * BehaviourTree的驱动脚本
 */
export default abstract class BTBrain extends cc.Component implements IBehaviourTree {
    
    @property({ tooltip: "是否在加载后立刻启动" })
    isEnableOnAwake: boolean = true;
    @property({ tooltip: "是否循环执行行为树" })
    isLoopTree: boolean = true;

    protected treeEntry:TreeEntry;

    protected variable:ShareVariables;
 
    GetTreeEntry(): TreeEntry {
        return this.treeEntry;
    }

    GetVariable(): ShareVariables {
        return this.variable;
    }

    GetDeltaTime():number{
        return cc.director.getDeltaTime();
    }
    
    GetTime():number{
        return TimeManager.gameTotalTime;//cc.director.getTotalTime()/1000;
    }

    ReplaceTree(task:Task,autoRestart:boolean = true){
        let _treeStarted = this.treeEntry.isStarted;
        if(_treeStarted)
            this.StopTree();
        if(!!this.treeEntry.child){
            this.treeEntry.ReplaceChild(0,task);
        }
        else{
            this.treeEntry.AddChild(task);
        }
        if(_treeStarted&&autoRestart)
            this.StartTree();
    }

    onLoad(){
        this.treeEntry = new TreeEntry();
        this.variable = new ShareVariables();
        this.treeEntry.AddChild(this.GetRootTree());
        this.treeEntry.BindBehaviour(this,this.isEnableOnAwake,this.isLoopTree);
        this.treeEntry.AwakeTree();
    }

    update(dt){
        this.treeEntry.Tick();
    }

    onDestroy(){
        this.treeEntry.UnBindBehaviour();
    }

    /**获取对接TreeEntry的跟树 */
    abstract GetRootTree():Task;

    StartTree() {
        this.treeEntry.StartTree();
    }

    InterruptTree() {
        this.treeEntry.InterruptTree();    
    }

    PauseTree(paused: boolean) {
        this.treeEntry.PauseTree(paused);
    }

    StopTree() {
        this.treeEntry.StopTree();
    }

}
