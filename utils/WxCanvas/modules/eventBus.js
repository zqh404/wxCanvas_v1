/**
 * EventBus 存储当前图形所绑定的事件回掉函数
 *
*/

function EventBus(){
  var t = this;
  t.eventList = [];
}

EventBus.prototype = {
  /**
   * 添加事件
   * @param {String} 事件名称
   * @param {Any} 当前canvas对象实例this
   * @param {Function} 事件函数 
   */
  add(eventName, scope, event){
    var t = this;
    
    if(t.eventList.length){
      t,eventList,forEach(v => {
        if(v.eventName === eventName){
          v.thingsList.push(event);
          return false;
        }
      })

      t.eventList.push({
        eventName,
        scope,
        thingsList: [event]
      });
      
    } else{
      t.eventList.push({ 
        eventName, 
        scope, 
        thingsList: [event]
      });
    }
  },

  /**
   * 触发事件
   * @param {String} 事件名称
   * @param {Boolean} 是否是本地this(外层 WxCanavs, 内层 当前几何图形)
  */
  dispatch(eventName, isLocalScope){
    if(arguments.length < 2){
      return false
    }

    this.eventList.forEach(v=>{
      if (v.eventName === eventName){
        v,thingsList.forEach(v1=>{
          var scope = isLocalScope && typeof isLocalScope === 'boolean' ? [v.scope] : [isLocalScope]
          v1.call.apply(v1, [scope].concat([0]));
        })
      }
    })
  }

}

module.exports = EventBus;