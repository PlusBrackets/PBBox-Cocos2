// import { Graphics, math, Vec2 } from "cc"

export module GraphicsUtils {

    export const DrawSector = (graphics: cc.Graphics, startDegree: number, endDegree: number, rStart: number, rEnd: number, arcPrecisionScaler: number = 1, cx: number = 0, cy: number = 0): cc.Graphics => {
        let startAngle = (((startDegree % 360) + 360) % 360) / 180 * Math.PI
        let endAngle = (((endDegree % 360) + 360) % 360) / 180 * Math.PI;
        endAngle < startAngle && (endAngle += 2 * Math.PI);

        let r1 = rStart;
        let r2 = rEnd;

        let perAngle = Math.PI / 24 * arcPrecisionScaler;

        let currentAngle = startAngle;

        let startPosNormal = new cc.Vec2(Math.cos(startAngle), Math.sin(startAngle));
        let startPos: cc.Vec2 = new cc.Vec2(startPosNormal.x,startPosNormal.y).multiplyScalar(r1);
        let nextPos: cc.Vec2 = new cc.Vec2(startPosNormal.x,startPosNormal.y).multiplyScalar(r2);

        graphics.moveTo(startPos.x + cx, startPos.y + cy);
        graphics.lineTo(nextPos.x + cx, nextPos.y + cy);
        while (currentAngle != endAngle) {
            currentAngle += perAngle;
            currentAngle = cc['math'].clamp(currentAngle, startAngle, endAngle);
            nextPos.x = Math.cos(currentAngle) * r2;
            nextPos.y = Math.sin(currentAngle) * r2;
            graphics.lineTo(nextPos.x + cx, nextPos.y + cy);
        }
        nextPos.multiplyScalar(1 / r2 * r1);
        graphics.lineTo(nextPos.x + cx, nextPos.y + cy);
        currentAngle = endAngle;
        while (currentAngle != startAngle) {
            currentAngle -= perAngle;
            currentAngle = cc['math'].clamp(currentAngle, startAngle, endAngle);
            nextPos.x = Math.cos(currentAngle) * r1;
            nextPos.y = Math.sin(currentAngle) * r1;
            graphics.lineTo(nextPos.x + cx, nextPos.y + cy);
        }
        return graphics;
    }
}