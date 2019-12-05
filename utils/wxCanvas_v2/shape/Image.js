import Common from '../common.js';

class Image {
  constructor(opts) {
    let _t = this;

    _t.width = opts.width;
    _t.height = opts.height;
    _t.imageUrl = opts.imageUrl;

    _t.pos = {
      tx: opts.pos.tx,
      ty: opts.pos.ty,
      scale: opts.pos.scale,
      rotate: opts.pos.rotate,
    }

    _t.realPoints = []; //存储边角坐标

    _t.offset = {minX: null, minY: null, maxX: null, maxY: null};

    _t.params = Common.extends(Common.commonParams(), opts.params || {});

    _t.defaultColor = 'black';

    _t.isSelected = opts.isSelected || false;
  }

  draw(context) {
    this.realPoints = this.getRealPoints();
    this.getRange();
    this.createPath(context, this.realPoints);
  }

  update(opts) {
    this.pos = {
      tx: opts.pos.tx,
      ty: opts.pos.ty,
      scale: opts.pos.scale,
      rotate: opts.pos.rotate,
    }
    this.isSelected = opts.isSelected;
  }

  //获取四个顶点坐标
  getRealPoints() {
    let w = this.width * this.pos.scale, h = this.height * this.pos.scale;
    let {tx, ty} = this.pos;

    var points = [];

    points.push([tx - w / 2, ty - h / 2]);
    points.push([tx - w / 2, ty + h / 2]);
    points.push([tx + w / 2, ty + h / 2]);
    points.push([tx + w / 2, ty - h / 2]);

    return points
  }

  getRange() {
    let points = this.realPoints;
    let {minX, minY, maxX, maxY} = Common.geRange(points);

    this.offset.minX = minX;
    this.offset.minY = minY;
    this.offset.maxX = maxX;
    this.offset.maxY = maxY;
  }

  createPath(context, points) {
    context.save();
    context.beginPath();

    let w = this.width, h = this.height;
    let {tx, ty, scale, rotate} = this.pos;

    //旋转
    context.translate(tx,ty);

    context.rotate(rotate);
    context.translate(-tx, -ty);

    context.rect(tx - w / 2, ty - h / 2, w + 1, h + 1);

    //缩放
    context.translate(tx * (1 - scale), ty * (1 - scale));
    context.scale(scale, scale);

    context.drawImage(this.imageUrl, tx - w / 2, ty - h /2, w, h);
    
    context.closePath();

    // //填充色
    // if (this.params.fillMode === 'fill') {
    //   context.setFillStyle(this.params.fillColor || this.defaultColor);
    //   context.fill();
    // }

   

    //边框色
    if(this.isSelected){
      //设置变宽宽度
      context.setLineWidth(this.params.lineWidth);
      context.setStrokeStyle(this.isSelected ? this.params.selectedColor : this.params.fillColor || this.defaultColor);
      context.stroke();
    }
    

    //设置不透明度
    // context.setGlobalAlpha(this.params.opacity);

    context.restore();
  }

  setSelected(flag) {
    this.isSelected = flag;
  }
}

export default Image;