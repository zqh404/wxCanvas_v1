'use strict';

export default {
  //返回一些平面几何共用的初始化参数
  commonAttribute(){
    return {
      lineWidth: 0.5, //线宽

      //图形阴影属性
      shadow: {
        offsetX: 5,
        offsetY: 5,
        blur: 5,
        color: "#000000"
      },

      fillStyle: '#000000', //填充色
      strokeStyle: '#000000', //边框色
      rotate: 0, //旋转角度
      opacity: 1, //透明度
      lineDash: [[5, 5], 5],
      miterLimit: 3
    } 
  }
};