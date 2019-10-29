"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _x = _interopRequireDefault(require('../vendor.js')(4));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = new _x["default"].Store({
  state: {
    counter: 0
  },
  mutations: {
    increment: function increment(state) {
      state.counter++;
    },
    decrement: function decrement(state) {
      state.counter--;
    }
  },
  actions: {
    increment: function increment(_ref) {
      var commit = _ref.commit;
      commit('increment');
    },
    decrement: function decrement(_ref2) {
      var commit = _ref2.commit;
      commit('decrement');
    },
    incrementAsync: function incrementAsync(_ref3) {
      var commit = _ref3.commit;
      setTimeout(function () {
        commit('increment');
      }, 1000);
    }
  }
});

exports["default"] = _default;