export type FrameCmd = { funcName: string, params: any[], thisArg: any, cost: number };

export default class FrameCmdExecutor {

    private _cmds: FrameCmd[];
    maxCost: number;

    /**
     * 
     */
    constructor(maxCost: number = 100) {
        this._cmds = [];
        this.maxCost = maxCost;
    }

    PushCommand(cmd: FrameCmd): FrameCmdExecutor {
        this._cmds.push(cmd);
        return this;
    }

    Execute(): boolean {
        if (this._cmds.length) {
            let cost = 0;
            while (cost < this.maxCost && this._cmds.length > 0) {
                const cmd = this._cmds.shift();
                if (cmd) {
                    cmd.thisArg[cmd.funcName](...cmd.params);
                    cost += cmd.cost;
                }
            }
            return true;
        }
        return false;
    }
}