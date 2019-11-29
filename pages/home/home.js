import {WxCanvas, Shape} from '../../utils/wxCanvas_v1.0.0/index.js';

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxCanvas: null,
    canvasWidth: 400,
    canvasHeight: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var sWidth = 0, sHeight = 0;
    var _t = this;
    wx.getSystemInfo({
      success: function(res) {
        // sWidth = res.windowWidth// - 56;
        // sHeight = res.windowHeight //-  200;

        _t.init(res.windowWidth, res.windowHeight);
      },
    });

  },

  init: function (sWidth, sHeight){
    this.setData({
      canvasWidth: sWidth,
      canvasHeight: sHeight
    });

    console.log(`canvas ${sWidth}, ${sHeight}`);

    var context = wx.createCanvasContext('myCanvas');

    // context.setStrokeStyle('red')
    // context.strokeRect(10, 10, 150, 75)
    // context.draw()

    this.wxCanvas = new WxCanvas(context, {
      x: 0, y: 0, w: sWidth, h: sHeight, preserveObjectStacking: true
    });



    var rect = new Shape("rect", { 
      x: 150, 
      y: 250, 
      w: 100, 
      h: 100, 
      fillMode: "fill",
      fillColor: "#36BBA6",
      strokeColor: "#36BBA6",
      // apiMode: true
    });

    var rect1 = new Shape("rect", {
      x: 200,
      y: 10,
      w: 50,
      h: 50,
      fillMode: "fill",
      fillColor: "#ffBBA6",
      strokeColor: "#36BBA6",
      // apiMode: true
    });


    var circle = new Shape("circle", {
      x: 150,
      y: 250,
      r: 100,
      fillMode: "fill",
      fillColor: "#36BBf0",
      strokeColor: "#36BBf0",
      // apiMode: true
    });


    var ellipse = new Shape('ellipse', {
      x: 150,
      y: 250,
      a: 100,
      b: 50,
      illMode: "fill",
      fillColor: "#7FFFD4",
      strokeColor: "#7FFFD4",
      apiMode: true
    })

    var polygon = new Shape('polygon', {
      x: 150,
      y: 250,
      r: 40, 
      sides: 8,
      illMode: "fill",
      fillColor: "#36BBA6",
      strokeColor: "#36BBA6",
      // apiMode: true
    });

    var cshape = new Shape('cshape', {
      points: [[145, 30], [0, -211], [300, 400], [113, 50], [30, -31], [3, 40], [123, 90], [20, -1], [30, 60], [131, 40], [90, -12], [0, 400], [13, 6], [70, -17], [30, 42]],
      fillMode: "fill",
      fillColor: "#36BBA6",
      strokeColor: "#36BBA6",
    })

    var line = new Shape('line', {
      points: [[145, 30], [0, -211], [300, 400], [113, 50], [30, -31], [3, 40], [123, 90], [20, -1], [30, 60], [131, 40], [90, -12], [0, 400], [13, 6], [70, -17], [30, 42]],
      fillMode: "fill",
      fillColor: "#36BBA6",
      strokeColor: "#36BBA6",
    })

    let text = new Shape('text', { x: 100, y: 100, text: "hello World", fillMode: "fill", fillColor: "#0CA5B0", fontSize: 20, rotate: 0, align: "center", textBaseline: 'middle', needShadow: true })

    var img = new Shape("img", { x: 100, y: 100, w: 100, h: 100, file: "./logo.png"});

    // this.wxCanvas.add(polygon);
  
    // this.wxCanvas.add(img);
    // this.wxCanvas.add(polygon);

    this.wxCanvas.add(rect);
    // this.wxCanvas.add(text);
    // this.wxCanvas.add(ellipse);
    // this.wxCanvas.removeShape(img);

    this.wxCanvas.update();

    console.log(this.wxCanvas);
  },
  
  bindtouchstart: function(e){
    this.wxCanvas.start(e);
    // console.log("start: ", e);
  },

  bindtouchmove: function(e){
    this.wxCanvas.move(e);
    // console.log("move: ", e);
  },

  bindtouchend: function(e){
    this.wxCanvas.end(e);
    // console.log("end: ", e);
  },

  bindtouchcancel: function(e){
    console.log("cancel: ", e);
  }

})