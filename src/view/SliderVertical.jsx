import React, { PureComponent } from 'react';

class SliderVertical extends PureComponent {
  containerRef = React.createRef();
  canvas = undefined;
  ctx = undefined;
  width = 0;
  height = 0;
  begin = 0;
  offsetY = 0;
  interval = 45;
  timeScaleWidth = 0;
  devicePixelRatio = Math.floor(window.devicePixelRatio);
  minY = 0;
  maxY = 0;
  moveAnimationId;
  // 判断是否移动
  moving = false;
  // 上次touch 位置
  lastTouch = {
    x: 0,
    y: 0,
  };
  minArea = 1;

  componentDidMount() {
    this.setViewport(true);
    this.createCanvas();
    this.drawAxis();
    this.drawCurrentTime();
  }

  componentWillUnmount() {
    this.setViewport();
  }

  setViewport = (normal) => {
    const meta = document.querySelector('meta[name="viewport"]');
    const size = normal ? 1 / this.devicePixelRatio : 1;

    meta.setAttribute(
      'content',
      `width=device-width,user-scalable=no,initial-scale=${size} ,maximum-scale=${size},minimum-scale=${size}, user-scalable=no, viewport-fit=cover`
    );
  };

  createCanvas = () => {
    const canvas = document.createElement('canvas');
    const { width, height } = this.containerRef.current.getBoundingClientRect();

    this.width = width * this.devicePixelRatio;
    this.height = height * this.devicePixelRatio;
    canvas.height = this.height;
    canvas.width = this.width;

    this.containerRef.current.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.init();
    this.attachEvent();
  };

  init = () => {
    this.ctx.font = `${14 * this.devicePixelRatio}px -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei,
		Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
		'Helvetica Neue', 'Source Han Serif SC', 'Source Han Sans CN',
		WenQuanYi Micro Hei, Noto Sans CJK SC, sans-serif`;

    this.maxRows = Math.ceil(this.height / this.interval / this.devicePixelRatio);
    this.timeScaleWidth = (this.width / this.devicePixelRatio) * 0.15;
    // 多 2 个空白区域
    this.maxY = (48 + 2 - this.maxRows) * this.interval;
  };

  attachEvent = () => {
    this.canvas.addEventListener('touchstart', this.onTouchStart);
    this.canvas.addEventListener('touchmove', this.onTouchMove);
    this.canvas.addEventListener('touchend', this.onTouchEnd);
    this.canvas.addEventListener('touchcancel', this.onTouchEnd);
  };

  removeEvent = () => {};

  calTouchIndex = () => {
    let pageY = this.offsetY + this.touch.y;
    let i = 0;

    while (i <= 48) {
      if (i * this.interval > pageY) {
        return i - 1;
      }
      i++;
    }

    return -1;
  };

  onTouchStart = (event) => {
    const { changedTouches } = event;
    const { pageX, pageY } = changedTouches[0];

    this.lastTouch = {
      x: pageX,
      y: pageY,
    };
    this.touch = {
      ...this.lastTouch,
    };
    this.scrollSpeed = 0;
  };

  onTouchMove = (event) => {
    // 防止点击事件触发
    event.preventDefault();

    const { changedTouches } = event;
    const { pageX, pageY } = changedTouches[0];

    this.touch = {
      x: pageX,
      y: pageY,
    };

    const move = {
      x: pageX - this.lastTouch.x,
      y: pageY - this.lastTouch.y,
    };

    this.lastTouch = {
      ...this.touch,
    };

    if (Math.abs(move.y) >= 1) this.moving = true;

    let animationId = this.animationId;

    this.animationId = requestAnimationFrame(() => {
      cancelAnimationFrame(animationId);

      // console.log(this.begin)
      // this.drawAxis();
      this.drawScroll(this.offsetY - move.y);
    });
  };

  onTouchEnd = () => {
    this.moving = false;
    this.scrollTouch = null;
    cancelAnimationFrame(this.animationId);
  };

  drawScroll = (y = 0) => {
    this.offsetY = y < this.minY ? this.minY : Math.min(y, this.maxY);

    this.drawAxis();
    this.drawCurrentTime();
  };

  drawAxis = () => {
    const beginIndex = Math.floor(this.offsetY / this.interval);
    const endIndex = beginIndex + this.maxRows;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    // 设置起点坐标
    this.ctx.translate(0, -this.offsetY);
    this.ctx.fillStyle = 'rgba(0,0,0,0.65)';
    this.ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    this.ctx.strokeWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(this.timeScaleWidth, 0);
    this.ctx.lineTo(this.timeScaleWidth, this.height);
    this.ctx.stroke();
    for (let i = beginIndex; i <= endIndex; i++) {
      if (i === 0) continue;
      if (i % 2 === 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.timeScaleWidth - 10, i * this.interval);
        this.ctx.lineTo(this.width, i * this.interval);
        this.ctx.stroke();
        const even = (i & 1) === 1,
          hour = Math.floor(i / 2),
          minute = even ? '00' : '30';
        const text = `${hour < 10 ? '0' + hour : hour}:${minute}`;
        this.ctx.fillText(text, this.timeScaleWidth - 90, i * this.interval + 10, this.timeScaleWidth);
      } else {
        this.ctx.beginPath();
        this.ctx.moveTo(this.timeScaleWidth - 10, i * this.interval);
        this.ctx.lineTo(this.timeScaleWidth, i * this.interval);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  };

  drawCurrentTime = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours(),
      currentMinute = currentDate.getMinutes();

    const index = currentHour * 2;

    const offset = (index + 1) * this.interval + (this.interval * currentMinute) / 30 - this.offsetY;
    this.ctx.save();
    this.ctx.fillStyle = '#ff4d4f';
    this.ctx.strokeStyle = '#ff4d4f';
    this.ctx.lineWidth = 2;
    this.ctx.fillText(`${currentHour}: ${currentMinute}`, this.timeScaleWidth - 90, offset, this.timeScaleWidth);
    this.ctx.beginPath();
    this.ctx.moveTo(this.timeScaleWidth - 10, offset);
    this.ctx.lineTo(this.width, offset);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  };

  render() {
    return <div ref={this.containerRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
  }
}

// function strokeRoundRect(ctx, x, y, width, height, radius, lineWidth, strokeColor) {
//   if (2 * radius > width || 2 * radius > height) return false;

//   ctx.save();
//   ctx.translate(x, y);
//   drawRoundRectPath(ctx, width, height, radius);
//   ctx.lineWidth = lineWidth || 2;
//   ctx.strokeColor = strokeColor || '#000';
//   ctx.stroke();
//   ctx.restore();
// }

// function fillRoundRect(ctx, x, y, width, height, radius, /*optional*/ fillColor) {
//   //圆的直径必然要小于矩形的宽高
//   if (2 * radius > width || 2 * radius > height) {
//     return false;
//   }

//   ctx.save();
//   ctx.translate(x, y);
//   //绘制圆角矩形的各个边
//   drawRoundRectPath(ctx, width, height, radius);
//   ctx.fillStyle = fillColor || '#000'; //若是给定了值就用给定的值否则给予默认值
//   ctx.fill();
//   ctx.restore();
// }

// function drawRoundRectPath(ctx, width, height, radius) {
//   ctx.beginPath(0);
//   // 顺时针绘制
//   // 右下角
//   ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
//   ctx.lineTo(radius, height);
//   // 左下角
//   ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
//   ctx.lineTo(0, radius);
//   // 左上角
//   ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
//   ctx.lineTo(width - radius, 0);
//   // 右上角
//   ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
//   ctx.lineTo(width, height - radius);
//   ctx.closePath();
// }

export default SliderVertical;
