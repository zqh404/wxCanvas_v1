function Gesture(options) {
  options = options || {};

  this.fingers = 0; //记录手指数量
  this.startPoint = {}; //第一次触控点
  this.secondPoint = {}; //第二次触控点
  this.pinchStartLength = null; //两指间的向量的模
  this.vector1 = {}; //坐标向量
  this.scale = 1; // 缩放比例
  this.rotate = 0; //旋转角度
  this.deltaX = 0; //平移x轴距离
  this.deltaY = 0; //平移y轴距离
  this.isDoubleMove = options.isDoubleMove || false; //是否开启双指移动

  /**
   * 度量衡说明
   * 1、angle角度制, 可用于DOM的transform角度变化
   * 2、radius弧度制, 可用于Canvas的rotate弧度变化
   */
  this.weightsAndMeasures = options.weightsAndMeasures || "angle";
}

Gesture.prototype = {
  start(e, callback) {
    if (!e.touches) {
      return;
    }

    //记录屏幕上的手指数量
    this.fingers = e.touches.length;

    //记录第一次触控点
    this.startPoint = this.getPoint(e, 0);

    //双指操作
    if (this.fingers > 1) {
      //第二触控点
      this.secondPoint = this.getPoint(e, 1);

      //计算双指向量
      this.vector1 = this.getVector(this.secondPoint, this.startPoint);

      //计算向量的模
      this.pinchStartLength = this.getLength(this.vector1);
    }

    //回掉函数
    if (callback) {
      callback({deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale});
    }
  },
  move(e, callback) {
    if (!e.touches) {
      return;
    }

    let curFingers = e.touches.length,
      curPoint = this.getPoint(e, 0),
      pinchLength;

    /**
     * 当从两指到一指过度的时候，可能会出现基础手指的变化，导致跳动情况；
     * 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
     */
    if (curFingers < this.fingers) {
      this.startPoint = curPoint;
      this.fingers = curFingers;
      return;
    }

    /**
     * 当从单指变双指过度的时候，可能会出现基础手指的变化，导致跳动、缩放和旋转不正常；
     * 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
     * 同时需要重置缩放比例、旋转角度， 并记录从单指变成双指时初始缩放模距和向量，保证缩放和旋转在下一次变化的平滑过度
     */
    if (curFingers > this.fingers) {
      this.startPoint = curPoint;
      this.secondPoint = this.getPoint(e, 1);
      this.vector1 = this.getVector(this.secondPoint, this.startPoint);
      this.pinchStartLength = this.getLength(this.vector1);
      this.fingers = curFingers;
      this.rotate = 0;
      this.scale = 1;
      return;
    }

    /**
     * 两指先后触摸时，只会触发第一指一次 touchstart，第二指不会再次触发 touchstart；
     * 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
     */
    if (curFingers > 1 && (!this.secondPoint || !this.vector1 || !this.pinchStartLength)) {
      this.secondPoint = this.getPoint(e, 1);
      this.vector1 = this.getVector(this.secondPoint, this.startPoint);
      this.pinchStartLength = this.getLength(this.vector1);
    }

    //双指旋转、缩放
    if (curFingers > 1) {
      let curSecPoint = this.getPoint(e, 1),
        vector2 = this.getVector(curSecPoint, curPoint);

      pinchLength = this.getLength(vector2);

      this.scale = pinchLength / this.pinchStartLength;

      this.pinchStartLength = pinchLength;

      this.rotate = this.getAngle(this.vector1, vector2);

      this.vector1 = vector2;

      //在双指移动模式下，可进行平移，否则不进行
      if (this.isDoubleMove) {
        this.deltaX = curPoint.x - this.startPoint.x;
        this.deltaY = curPoint.y - this.startPoint.y;
      } else {
        this.deltaX = 0;
        this.deltaY = 0;
      }

    } else { //单指情况只进行平移，不进行旋转缩放
      this.deltaX = curPoint.x - this.startPoint.x;
      this.deltaY = curPoint.y - this.startPoint.y;
      this.rotate = 0;
      this.scale = 1;
    }

    this.startPoint = curPoint;

    if (callback) {
      callback({deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale});
    }
  },

  //触摸结束下，重置几何操作参数
  end(e) {
    this.deltaX = this.deltaY = this.rotate = 0;
    this.scale = 1;
  },

  //获取点坐标
  getPoint(e, index) {
    if (!e.touches) {
      return
    }
    return {
      x: Math.round(e.touches[index].x || e.touches[index].pageX),
      y: Math.round(e.touches[index].y || e.touches[index].pageY),
    }
  },

  //计算向量
  getVector(p1, p2) {
    if (!p1 || !p2) {
      return
    }

    return {
      x: Math.round(p1.x - p2.x),
      y: Math.round(p1.y - p2.y)
    }
  },

  //计算向量的模
  getLength(v) {
    if (!v) {
      return;
    }

    return Math.sqrt(v.x * v.x + v.y * v.y);
  },

  //计算点前后变化的旋转角度
  getAngle: function getAngle(v1, v2) {
    /**
     * 判断旋转方向：
     * 顺时针旋转为 1， 逆时针旋转为 -1
     */
    var direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1,

      // 计算两个向量的模
      len1 = this.getLength(v1),
      len2 = this.getLength(v2),
      mr = len1 * len2,
      dot, r;

    if (mr === 0) {
      return 0;
    }

    // 通过数量积公式可以推导出：
    // cos = (x1 * x2 + y1 * y2)/(|a| * |b|);
    dot = v1.x * v2.x + v1.y * v2.y;
    r = dot / mr;

    //cos值区间在[-1, 1]，不能超过该三角函数cos的纵坐标区间
    r = r > 1 ? 1 : (r < -1 ? -1 : r);

    // 输出角度
    let angleOrRadius = Math.acos(r) * direction * 180 / Math.PI;

    if (this.weightsAndMeasures === 'radius') {
      angleOrRadius = angleOrRadius * Math.PI / 180;
    }

    return angleOrRadius
  },

  //获取变量类型
  getType(v) {
    return typeof v
  }
};

Gesture.prototype.constructor = Gesture;

if (window) {
  window.Gesture = Gesture;
} else {
  module.exports = Gesture;
}
