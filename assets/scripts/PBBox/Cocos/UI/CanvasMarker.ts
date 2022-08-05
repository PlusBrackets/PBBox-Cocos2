// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// // import { _decorator, Component, Canvas } from "cc";
// import Dictionary from "../../Variables/Dictionary";

// const { ccclass, requireComponent, menu, property } = _decorator;

// @ccclass @menu("PBBox/UIComponent/CanvasMarker") @requireComponent(Canvas)
// export default class CanvasMarker extends Component {

//     private static _canvasDict?: Dictionary<Canvas>;

//     static Get(mark: string): Canvas {
//         if (!this._canvasDict)
//             return null;
//         return this._canvasDict.Get(mark);
//     }

//     @property
//     private mark: string = "";

//     private canvas!: Canvas;

//     onLoad() {
//         if (!this.mark) {
//             console.warn("CanvasMarker没有标记")
//             return;
//         }
//         this.canvas = this.getComponent(Canvas);
//         if (!CanvasMarker._canvasDict)
//             CanvasMarker._canvasDict = new Dictionary<Canvas>();
//         if (CanvasMarker._canvasDict.Has(this.mark))
//             return;
//         CanvasMarker._canvasDict.Set(this.mark, this.canvas);
//     }

//     onDestroy() {
//         !!this.mark && CanvasMarker._canvasDict?.Delete(this.mark);
//     }
// }
