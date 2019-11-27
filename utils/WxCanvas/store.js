function Store(){
  this.store = [];
}

Store.prototype = {
  add(shape){
    this.store.push(shape);
  },

  update(){},

  delete(){},

  getLength(){
    return this.store.length;
  },

  find(){},

  changeIndex(){},

  clear(){
    this.store = [];
  }
};

module.exports = Store;