'use strict';

module.exports =  {
  //浅对象数据合并
  _extends(){
   return Object.assign || function(target){
     for(var i = 0, len = arguments.length; i < len; i++){
       var source = arguments[i]; //源对象数据

       for(var key in source){
         if(Object.prototype.hasOwnProperty.call(source, key)){
           target[key] = source[key]; //输出对象填值
         }
       }

       return target;
     }
   } 
  },

  /**
   * @param {Object} 目标对象（覆盖）
   * @param {Object} 源对象 （被覆盖）
   * @param {Boolean} 是否被覆盖
  */
  _extendCover(target, source, isOverlay = false){
    var _temS = util.clone(source);

    if (!isOverlay) {
      for (var key in target) {
        if (source.hasOwnProperty(key)) //如果是覆盖的话 只要源source 有那就覆盖掉
        {
          if (_typeof(source[key]) == "object" && !(source[key] instanceof Array)) {
            // console.log(key);
            _temS[key] = util.extend(target[key], _temS[key]); //递归
          } else {
            _temS[key] = target[key];
          }
        }
      }
    } else {
      for (var key in target) {
        if (target.hasOwnProperty(key)) {
          if (_typeof(source[key]) == "object" && !(source[key] instanceof Array)) {
            _temS[key] = util.extend(target[key], _temS[key], true); //递归
          } else {
            _temS[key] = target[key];
          }
        }
      }
    }
    return _temS;
  },

  updateOptions(options){
    var t = this;

    t.options = options;
    t.bus.dispatch("update", true);
  }
}