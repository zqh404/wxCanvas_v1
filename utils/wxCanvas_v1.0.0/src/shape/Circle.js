import Common from '../../common.js';

class Circle {
  constructor(options, guid) {
    let _t = this;

    _t.guid = guid;

    /**
     * x - 圆心x轴坐标
     * y - 圆心y轴坐标
     * r - 圆半径
     * startAngle - 开始角度
     * endAngle - 结束角度
     */
    _t.options = Common._extends({
      x: 0,
      y: 0,
      r: 10,
      startAngle: 0,
      endAngle: Math.PI * 2
    }, Common.commonParams(), options || {});

    _t.defaultColor = "black";

    _t.realPoints = []; //真实点

    _t.pointsNumber = 100;

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }
  }


  getRealPoints() {
    var {x, y, r, startAngle, endAngle} = this.options;
    var angle = endAngle - startAngle;
    var points = [];

    for (let i = 0; i <= this.pointsNumber; i++) {
      let curAngle = startAngle + i * angle / 100;
      points.push([x + r * Math.sin(curAngle), y + r * Math.cos(curAngle)])
    }

    points.unshift([x, y]);

    return points;
  }

  //绘制
  _draw(context) {
    if (!this.options.apiMode) {
      this.realPoints = this.getRealPoints();
    }
    this.createPath(context, this.realPoints);
  }

  //创建绘制
  createPath(context, points) {
    context.save();
    context.beginPath();

    if (this.options.apiMode) {
      let {x, y, r, startAngle, endAngle} = this.options;

      context.arc(x, y, r, startAngle, endAngle);

    } else {
        context.moveTo(points[0][0], points[0][1]);

        for(let i = 1; i <= this.pointsNumber + 1; i++){
          context.lineTo(points[i][0], points[i][1]);
        }
    }

    context.closePath();

    //填充色
    if (this.options.fillMode === "fill") {
      context.setFillStyle(this.options.fillColor || this.defaultColor);
      context.fill();
    }

    //边框色
    context.setStrokeStyle(this.options.strokeColor || this.defaultColor);
    context.stroke();

    //设置边框宽度
    context.setLineWidth(this.options.lineWidth);

    //设置不透明度
    context.setGlobalAlpha(this.options.opacity);

    context.restore();
    // context.draw();

  }

}

export default Circle;