import Shape from './shape/index.js';
import Store from './store.js';

class WxCanvas {
  constructor(canvas, opts) {
    let _t = this;

    _t.canvas = canvas; //canvas实例

    _t.checkStatus(canvas);

    //配置参数
    _t.opts = opts || {
      x: 0,
      y: 0,
      w: 400,
      h: 400
    };

    //启动该配置,将每次被点击的图层几何不能置于最高级别,默认为false（不启动）
    // _t.preserveObjectStacking = opts.preserveObjectStacking || false;

    // _t.touchesShape = []; //存储单击情况被选中的几何图形

    _t.store = new Store(); //初始化仓库，用于存储几何

    _t.currentTouchShape = null; //当前被操作的几何图形
  }

  //检查状态
  checkStatus(canvas) {
    if (canvas === undefined || !canvas) {
      throw Error("canvas is no defined, please check it");
    }
  }

  //添加几何,并进入仓库
  add(s) {
    if (!s) {
      return console.warn("This shape is null, please check it which is existing");
    }

    this.store.add(s);
  }


  //更新画布内容
  update() {
    let store = this.store.getStore(); //获取仓库

    if (!store.length) {
      return;
    }

    //先清除画布内容
    this.clear();

    //重新调用仓库存储的几何图形，并在画布于绘制
    store.forEach((v, idx) => {
      v.setZIndex(idx + 1); //设置图层层级
      v.draw(this.canvas);
    });

    this.canvas.draw();
  }

  //从仓库中移除该几何图形
  remove(s) {
    if (!s) {
      return console.warn("This shape is null, please check it which is existing");
    }

    this.store.remove(s);
  }

  //清除画布中所有内容
  clear() {
    //先清除画布内容
    let {x, y, w, h} = this.opts;
    this.canvas.clearRect(x, y, w, h);
  }

  //获取canvas
  getCanvas() {
    return this.canvas || null;
  }

  //获取图层最高的几何图形
  getMostHighShape(shapes) {
    let highZIndexShape = shapes[0];

    for (let i = 0, len = shapes.length; i < len; i++) {
      if (highZIndexShape.zIndex < shapes[i].zIndex) {
        highZIndexShape = shapes[i];
      }
    }

    return highZIndexShape;
  }

  //点击之后,获取被选中几何
  getTouchShape(e) {
    let store = this.store.getStore();

    if (!store.length) {
      return;
    }

    let location = {x: e.touches[0].x, y: e.touches[0].y};

    let activeShape = [], currentShape = null; //记录活跃的几何

    for (let i = 0, len = store.length; i < len; i++) {
      let item = store[i];

      let isDetected = item.detect(location); //判断当前触控点是否在该图形有效区间内

      if (isDetected) {
        activeShape.push(item);
      }
    }

    //从活跃的集合中提取图层最高的一个
    if (activeShape.length > 1) {
      currentShape = this.getMostHighShape(activeShape);
    } else if (activeShape.length === 1) {
      currentShape = activeShape[0];
    }

    this.resetAllShapeStatus();

    return currentShape;
  }

  //重置设置所有图形选中状态
  resetAllShapeStatus(store) {
    store = store ||  this.store.getStore();

    if (!store.length) {
      return;
    }

    store.forEach(v => {
      v.setSelected(false);
    });
  }

  //触控开始
  start(e) {
    if (!e || !e.touches) {
      return;
    }

    /**
     * 记录触控点，当用户第一次点击时候，需要判断两个状态：
     * 1、是否是在选择某一个几何，然后再进行未来操作；
     * 2、是否仅仅是进行某个几何的操作；
     *
     * 注：双指触控点不计入。
     */
    let fingers = e.touches.length; //记录触控点

    if (fingers === 1) {
      let touchShape = this.getTouchShape(e);

      this.currentTouchShape = touchShape ? touchShape : this.currentTouchShape;
    }

    if (this.currentTouchShape) {
      this.resetAllShapeStatus(); //所有几何图形选中状态重新设置
      this.currentTouchShape.setSelected(true); //设置选中状态
      this.currentTouchShape.update(); //更新
      this.update(); //画布重新绘制
      this.currentTouchShape.start(e);
    }
  }

  //触控中
  move(e) {
    let _t = this;

    if (!e || !e.touches || !_t.currentTouchShape) {
      return;
    }

    _t.currentTouchShape.move(e, function () {
      _t.currentTouchShape.update(); //更新几何参数

      let store = _t.store.getStore();
      //仓库的全部几何图形进行更新
      store.forEach(v => {
        v.draw(_t.canvas);
      });

      _t.canvas.draw();
    });
  }

  //触控结束
  end(e) {
    if (this.currentTouchShape) {
      this.currentTouchShape.end(e);
    }
  }

  cancel(e) {

  }
}


module.exports = {
  WxCanvas,
  Shape
}

