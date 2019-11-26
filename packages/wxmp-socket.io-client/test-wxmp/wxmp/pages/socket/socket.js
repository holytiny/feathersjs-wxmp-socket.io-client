// 获取应用实例
const socketTestCases = require('../../test-cases/socket.test.js');
const app = getApp()

Page({
  data: {
    testResults: [],
    testPercent: 0
  },
  onLoad: async function () {
    for (let i = 0, length = socketTestCases.length; i < length; ++i) {
      const test = socketTestCases[i];
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
  }
});

