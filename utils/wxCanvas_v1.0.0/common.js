/**
 * 公共方法库
 */

module.exports = {
  //浅拷贝
  // _extends(target, source) {
  //   return Object.assign ? Object.assign(target, source) : function (target, source) {
  //     for (let key in source) {
  //       if (source.hasOwnProperty(key)) {
  //         target[key] = source[key];
  //       }
  //     }
  //     return target;
  //   }
  // },

  //浅拷贝
  _extends(target) {
    let argLen = arguments.length;

    for (let i = 1; i < argLen; i++) {
      let source = arguments[i];

      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  },
  /**
   * 公共参数，用于图形参数设置，除图片
   * fillMode - 填充模式(fill, stroke)
   * isDrag - 是否可操作，默认可操作
   * fillColor - 填充色
   * strokeColor - 边框色
   * opacity - 不透明度 （0 ~ 1）
   * apiMode - api绘制方式， 即使用小程序提供的api接口进行绘制, 默认为false
   */
  commonParams() {
    return {
      fillMode: 'fill',
      fillColor: "",
      strokeColor: "",
      selectedColor: '#5CACEE',
      lineWidth: 2,
      opacity: 1,
      isDrag: true,
      apiMode: false,
      isSelected: false
    }
  },

  /**
   * 判断一个点是否在几何内
   * 1、首先第一步是判断该点是否在（minX, minY）和 （maxX, maxY）,是的话走第二步，否则停止;
   * 2、Pnpoly算法(核心算法部分)
   * https://www.cnblogs.com/anningwang/p/7581545.html
   * https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
   */
  pnpoly(slides, points, offset, location) {
    let i, j, flag = false;
    let {x, y} = location;

    if (offset.minX > x || offset.maxX < x || offset.minY > y || offset.maxY < y) {
      return flag = false
    }

    for (i = 0, j = slides - 1; i < slides; j = i++) {
      if (((points[i][1] > y) != (points[j][1] > y)) &&
        (x < (points[j][0] - points[i][0]) * (y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])) {
        flag = !flag;
      }
    }

    return flag;
  },

  //边缘检测
  _detect(shape, location) {
    let {realPoints, offset} = shape;
    let flag = this.pnpoly(realPoints.length, realPoints, offset, location);
    return flag;
  },

  geRange(options) {
    let offset = {minX: null, minY: null, maxX: null, maxY: null};

    options.forEach(point => {
      if (point[0] > offset.maxX) {
        offset.maxX = point[0];
      }
      if (!offset.minX && offset.minX !== 0) {
        offset.minX = point[0];
      }
      if (offset.minX && point[0] < offset.minX) {
        offset.minX = point[0];
      }

      if (point[1] > offset.maxY) {
        offset.maxY = point[1];
      }

      if (!offset.minY && offset.minY !== 0) {
        offset.minY = point[1];
      }

      if (offset.minY && point[1] < offset.minY) {
        offset.minY = point[1];
      }
    })

    return offset;
  },

  //计算两点间距离
  getDistance(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  },

  //获取角度,向量求值法
  getAngele(v1, v2) {  
    //判断方向，顺时针为 1，逆时针为 -1
    let direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1;

    //计算两个向量的模
    let len1 = this.getDistance(v1), len2 = this.getDistance(v2);

    let mr = len1 * len2, dot, r;

    if(mr === 0){
      return 0;
    }

    //数量积公式推导
    dot = v1.x * v2.x + v1.y * v2.y;
    r = dot / mr;

    if(r > 1){
      r = 1;
    }else if(r < -1){
      r = -1;
    }

    //解值并结合方向转化为角度值
    return Math.acos(r) * direction * 180 / Math.PI;
  },
}