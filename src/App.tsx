import { useCallback, useEffect, useRef } from "react";
import { useMouseMove } from "./hooks";
import * as utils from "./utils";

function App() {
    const lastCoords = useRef({ x: 0, y: 0 });
    const { x, y } = useMouseMove();
    const canvas = utils.getCanvas();

    const dblClickHandler = useCallback(() => {
        if (!canvas) return;

        const { width, height } = canvas;
        const ctx = canvas?.getContext("2d");
        ctx?.clearRect(0, 0, width, height);
    }, [canvas]);

    const resizeHandler = useCallback(() => {
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, [canvas]);

    const init = useCallback(() => {
        canvas?.focus();
        const ctx = canvas?.getContext("2d");

        if (!ctx) return;

        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
    }, [canvas]);

    useEffect(() => {
        init();

        window.addEventListener("resize", resizeHandler);
    }, [canvas, dblClickHandler, init, resizeHandler]);

    const drawRandomPoint = (
        distance: number,
        ctx: CanvasRenderingContext2D
    ) => {
        if (Math.random() * 100 > 20) return;

        const {
            current: { x: lastX, y: lastY },
        } = lastCoords;

        const a = distance * 8 * (Math.pow(Math.random(), 2) - 0.5);
        const r = Math.random() - 0.5;
        ctx.lineWidth = utils.getRandomArbitrary(2, 10);
        ctx.moveTo(lastX + a, lastY + a);
        ctx.lineTo(lastX + r + a, lastY + r + a);
    };

    const drawEllipse = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.ellipse(
            x,
            y,
            utils.getRandomArbitrary(20, 40),
            utils.getRandomArbitrary(20, 40),
            utils.degreeToRadian(utils.getRandomArbitrary(0, 360)),
            0,
            2 * Math.PI
        );
        ctx.fill();
    }, [x, y]);

    useEffect(() => {
        if (lastCoords.current.x === 0 && lastCoords.current.y === 0) {
            lastCoords.current = { x, y };
        }

        const ctx = canvas?.getContext("2d");

        if (!ctx) return;

        const {
            current: { x: lastX, y: lastY },
        } = lastCoords;

        const distance = utils.distance(lastX, x, lastY, y);
        const speed = utils.speed(distance);
        const lineWidth = utils.getLineWidth(speed);

        console.log(`speed: ${speed} \nlineWidth: ${lineWidth}`);

        const disX = (lastX - x) * Math.sin(0.5) + x;
        const disY = (lastY - y) * Math.cos(0.5) + y;

        ctx.moveTo(lastX, lastY);
        ctx.quadraticCurveTo(disX, disY, lastX, lastY);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);

        drawRandomPoint(distance, ctx);

        const isEllipse = Math.random() > 0.3;

        if (lineWidth > 35 && isEllipse) {
            drawEllipse(ctx);
        } else {
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        lastCoords.current = { x, y };
    }, [canvas, drawEllipse, x, y]);

    const handleClick = useCallback(() => {
        const ctx = canvas?.getContext("2d");

        if (!ctx) return;

        const color = utils.getRandomColor();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.closePath();
    }, [canvas]);

    return (
        <div className="App">
            <canvas
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={handleClick}
                onDoubleClick={dblClickHandler}
            />
        </div>
    );
}

export default App;
