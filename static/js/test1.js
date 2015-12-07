var common = require("./common");
require(["./shared"], function(shared) {
    shared("This is page A");
});


var Hello = React.createClass({
    render: function() {
        return <div>Hello {this.props.name} {this.props.dma}</div>;
    }
});


ReactDOM.render(
	<Hello name="World" dma="GoGo" />,
    document.getElementById('container')
);
