class Store{
  constructor(){
    this.store = [];
  }

  //加入仓库中
  add(v){
    if(!v){
      return console.warn('The value is null, please check it which is exist');
    }

    this.store.push(v);
  }

  //从仓库中移除,通过全局只有唯一一个guid来进行删除
  remove(v){
    if(!v && !this.store.length){
      return console.warn('Warning, check value!');
    }

    let index = null;

    for(let i = 0, len = this.store.length; i < len; i++){
      let item = this.store[i];

      if(item.guid === v.guid){
        index = i;
        break;
      }
    }

    if(index !== null){
      this.store.splice(index, 1);
    }
  }

  getStore(){
    return this.store;
  }

  clear(){
    this.store = [];
  }

  getLength(){
    return this.store.length;
  }

}

export default Store;