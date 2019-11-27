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
      lineWidth: 0.5,
      opacity: 1,
      isDrag: true,
      apiMode: false
    }
  },

  /**
   * 判断一个点是否在几何内
   * 1、首先第一步是判断该点是否在（minX, minY）和 （maxX, maxY）,是的话走第二步，否则停止;
   * 2、Pnpoly算法(核心算法部分)
   * https://www.cnblogs.com/anningwang/p/7581545.html
   * https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
   */
  pnpoly(slides, points, location) {
    let i, j, flag = 0;
    let {x, y} = location;

    for (i = 0, j = slides - 1; i < slides; j = i++) {
      if (((points[i].y > y) != (points[j].y > y)) &&
        (x < (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
        flag = !flag;
      }
    }

    return flag;
  },

  //边缘检测
  _detect(shape, location) {
    let {realPoints} = shape;
    let flag = this.pnpoly(realPoints.length, realPoints, location);
    return flag;
  }
}