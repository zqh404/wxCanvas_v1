import Common from '../common.js';

class Polygon{
  constructor(opts){
    let _t = this;

    _t.width = opts.width;
    _t.height = opts.height;

    _t.pos = {
      tx: opts.pos.tx,
      ty: opts.pos.ty,
      scale: opts.pos.scale,
      rotate: opts.pos.rotate,
    }


  }
}

export default Polygon;