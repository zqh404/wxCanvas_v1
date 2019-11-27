import Common from '../../common.js';


class Img {
  constructor(options, guid) {
    let _t = this;

    _t.guid = guid;

    /**
     * x - 图片中心 x 轴坐标
     * y - 图片中心 y 轴坐标
     * w - 图片宽度
     * h - 图片高度
     * file - 图片路径
     */
    _t.options = Common._extends({
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      file: ""
    }, options || {});

    _t.realPoints = [];
  }

  getRealPoints() {
    let {x, y, w, h} = this.options;
    let points = [];

    points.push([x - w / 2, y - h /2]);
    points.push([x - w / 2, y + h /2]);
    points.push([x + w / 2, y + h /2]);
    points.push([x + w / 2, y - h /2]);

    return points;
  }

  _draw(context) {
    this.realPoints = this.getRealPoints();

    this.createPath(context, this.realPoints);
  }

  createPath(context, points) {
    let {x, y, w, h, file} = this.options;

    context.save();
    // context.beginPath();

    context.drawImage(file, x, y, w, h);
    // context.closePath();
    context.restore();
    // context.draw();
  }
}

export default Img;