import * as utils from "./utils";

class Canvas {
  canvas: HTMLCanvasElement | null;
  lastCoords = { x: 0, y: 0 };

  constructor() {
    this.canvas = this.getCanvas();

    if (this.canvas) {
      this.canvas.addEventListener("dblclick", this.doubleClickHandler);
      this.canvas.addEventListener("click", this.clickHandler);
      this.canvas.addEventListener("mousemove", this.moveHandler);
      window.addEventListener("resize", this.resizeHandler);
      this.init();
    }
  }

  init = () => {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const ctx = this.canvas.getContext("2d");

    this.canvas.focus();

    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
  };

  doubleClickHandler = () => {
    if (!this.canvas) return;

    const { width, height } = this.canvas;
    const ctx = this.canvas.getContext("2d");
    ctx?.clearRect(0, 0, width, height);
  };

  clickHandler = () => {
    const ctx = this.canvas?.getContext("2d");

    if (!ctx) return;

    const color = utils.getRandomColor();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.closePath();
  };

  resizeHandler = () => {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  drawRandomPoint = (distance: number, ctx: CanvasRenderingContext2D) => {
    if (Math.random() * 100 > 20) return;

    const { x: lastX, y: lastY } = this.lastCoords;

    const a = distance * 8 * (Math.pow(Math.random(), 2) - 0.5);
    const r = Math.random() - 0.5;
    ctx.lineWidth = utils.getRandomArbitrary(2, 10);
    ctx.moveTo(lastX + a, lastY + a);
    ctx.lineTo(lastX + r + a, lastY + r + a);
  };

  drawEllipse = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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
  };

  moveHandler = ({ offsetX: x, offsetY: y }: MouseEvent) => {
    if (this.lastCoords.x === 0 && this.lastCoords.y === 0) {
      this.lastCoords = { x, y };
    }

    const ctx = this.canvas?.getContext("2d");

    if (!ctx) return;

    const { x: lastX, y: lastY } = this.lastCoords;

    const distance = utils.distance(lastX, x, lastY, y);
    const speed = utils.speed(distance);
    const lineWidth = utils.getLineWidth(speed);

    const disX = (lastX - x) * Math.sin(0.5) + x;
    const disY = (lastY - y) * Math.cos(0.5) + y;

    ctx.moveTo(lastX, lastY);
    ctx.quadraticCurveTo(disX, disY, lastX, lastY);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);

    this.drawRandomPoint(distance, ctx);

    const isEllipse = Math.random() > 0.3;

    if (lineWidth > 35 && isEllipse) {
      this.drawEllipse(ctx, x, y);
    } else {
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    this.lastCoords = { x, y };
  };

  getCanvas = () => document.querySelector("canvas");
}

export default Canvas;
