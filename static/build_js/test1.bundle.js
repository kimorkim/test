webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var common = __webpack_require__(1);
	__webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(2)]; (function (shared) {
	    shared("This is page A");
	}.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});

	var Hello = React.createClass({
	    render: function () {
	        return React.createElement("div", null, "Hello ", this.props.name, " ", this.props.dma);
	    }
	});

	ReactDOM.render(React.createElement(Hello, { name: "World", dma: "GoGo" }), document.getElementById('container'));

/***/ }
]);