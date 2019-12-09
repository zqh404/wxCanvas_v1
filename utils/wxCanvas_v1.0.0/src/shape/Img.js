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

    _t.translate = {x: 0, y: 0}; //位移坐标

    _t.offset = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    };
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
    this.getRange();
    this.createPath(context, this.realPoints);
  }

  createPath(context, points) {
    let {w, h, file} = this.options;

    context.save();
    context.drawImage(file, points[0][0], points[0][1], w, h);
    context.restore();
  }

  getRange() {
    let options = this.realPoints;
    let {minX, minY, maxX, maxY} = Common.geRange(options);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  //记录开始坐标
  getStartCoordinates(location){
    let {x, y} = this.options;
    this.translate.x = x - location.x;
    this.translate.y = y - location.y;
  }

  //移动
  move(location){
    this.options.x = location.x + this.translate.x;
    this.options.y = location.y + this.translate.y;
  }
}

export default Img;