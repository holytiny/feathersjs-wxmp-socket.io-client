// index.js
// 获取应用实例
const wssTestCases = require('../../test-cases/wss.test.js');
const app = getApp()

Page({
  data: {
    testResults: [],
    testPercent: 0
  },
  onLoad: async function () {
    for (let i = 0, length = wssTestCases.length; i < length; ++i) {
      const test = wssTestCases[i];
      const res = await test();
      this.data.testResults[i] = {
        result: res,
        description: test.description
      };
      this.setData({
        testPercent: (i + 1) / length * 100,
        testResults: this.data.testResults
      });
    }
  },
  gotoSocketTestPage: function () {
    console.log('goto socket test');
    wx.navigateTo({
      url: '../socket/socket'
      });
  }
});
