// class Gesture{
//   constructor(){
//     let _t = this;
//     _t.touch = {};
//     _t.movetouch = {};
//     _t.params = { zoom: 1, lastZoom: 1, deltaX: 0, deltaY: 0, diffX: 0, diffY: 0, angle: 0 };
//     _t.pretouch = {};
//     _t.preVector = { x: null, y: null };
//   }

//   touchstart(e, callback = () => { }) {
//     if (!e.touches) {
//       return;
//     }

//     let point = e.touches[0];

//     //记录手指位置
//     this.touch.startX = point.x;
//     this.touch.startY = point.y;

//     //双指
//     if (e.touches.length > 1) {
//       let point2 = e.touches[1];

//       this.preVector = { x: point2.x - this.touch.startX, y: point2.y - this.touch.startX };
//       this.startDistance = this.getLen(this.preVector);

//     } else {
//       this.pretouch = {
//         startX: this.touch.startX,
//         startY: this.touch.startY
//       };
//     }

//     callback(this.params, e);
//   }

//   touchmove(e, callback = () => { }) {
//     if (!e.touches) {
//       return;
//     }

//     let point = e.touches[0];

//     //多指
//     if (e.touches.length > 1) {
//       let point2 = e.touches[1];
//       let v = { x: point2.x - point.x, y: point2.y - point.y };

//       if (this.preVector.x != null) {
//         if (this.startDistance) {
//           let zoom = this.getLen(v) / this.startDistance;
//           this.params.zoom = zoom * this.params.lastZoom;
//         }
//         this.params.angle = this.getAngle(v, this.preVector);
//       }

//       this.preVector.x = v.x;
//       this.preVector.y = v.y;

//     } else {
//       let diffX = point.x - this.touch.startX;
//       let diffY = point.y - this.touch.startY;

//       this.params.diffX = diffX;
//       this.params.diffY = diffY;

//       //记录移动过程中与上一次移动的相对坐标
//       if (this.movetouch.x) {
//         this.params.deltaX = point.x - this.movetouch.x;
//         this.params.deltaY = point.y - this.movetouch.y;
//       } else {
//         this.params.deltaX = this.params.deltaY = 0;
//       }

//       this.movetouch.x = point.x;
//       this.movetouch.y = point.y;
//     }

//     callback(this.params, e);
//   }

//   touchend(e) {
//     let deltaX = ~~((this.movetouch.x || 0) - this.touch.startX);
//     let deltaY = ~~((this.movetouch.y || 0) - this.touch.startY);
//     this.preVector = { x: 0, y: 0 };
//     this.params.lastZoom = this.params.zoom;
//     this.params.angle = 0;
//     this.params.deltaX = this.params.deltaY = this.params.diffX = this.params.diffY =  0;
//     this.startDistance = null;
//   }

//   touchcancel(e) {
//     this.touchend(e);
//   }

//   getLen(v) {
//     return Math.sqrt(v.x * v.x + v.y * v.y);
//   }

//   getAngle(a, b) {
//     var l = this.getLen(a) * this.getLen(b), cosValue, angle;
//     if (l) {
//       cosValue = (a.x * b.x + a.y * b.y) / l;
//       angle = Math.acos(Math.min(cosValue, 1))
//       angle = a.x * b.y - b.x * a.y > 0 ? -angle : angle;
//       return angle * 180 / Math.PI;
//     }
//     return 0;
//   }
// }


// export default Gesture


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
      callback({ deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale });
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
      return callback({ deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale });
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
      return callback({ deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale });
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
      callback({ deltaX: this.deltaX, deltaY: this.deltaY, rotate: this.rotate, scale: this.scale });
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
    if (v) {
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
    return Math.acos(r) * direction * 180 / Math.PI;
  },

  //获取变量类型
  getType(v) {
    return typeof v
  }
};

Gesture.prototype.constructor = Gesture;

if (window) {
  window.Gesture = Gesture;
}

export default Gesture;

