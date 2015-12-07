webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Hello = React.createClass({
	    render: function () {
	        return React.createElement("div", null, "Hello ", this.props.name, " ", this.props.dma);
	    }
	});

	ReactDOM.render(React.createElement(Hello, { name: "World", dma: "GoGo" }), document.getElementById('container'));

	var common = __webpack_require__(1);
	__webpack_require__.e/* nsure */(1/* duplicate */, function (require) {
	    var shared = __webpack_require__(2);
	    shared("This is page B");
	});

/***/ }
]);