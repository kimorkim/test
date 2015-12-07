var Hello = React.createClass({
    render: function() {
        return <div>Hello {this.props.name} {this.props.dma}</div>;
    }
});


ReactDOM.render(
	<Hello name="World" dma="GoGo" />,
    document.getElementById('container')
);

var common = require("./common");
require.ensure(["./shared"], function(require) {
    var shared = require("./shared");
    shared("This is page B");
});
