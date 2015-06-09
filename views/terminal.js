import React from 'react';
import Invocation from './invocation';
import StatusLine from './status_line';

export default React.createClass({
    getInitialState() {
        return {
            vcsData: {isRepository: false},
            invocations: this.props.terminal.invocations
        };
    },
    componentWillMount() {
        this.props.terminal
            .on('invocation', _ => this.setState({invocations: this.props.terminal.invocations}))
            .on('vcs-data', data => this.setState({vcsData: data}));
    },
    handleKeyDown(event) {
        // Ctrl+L.
        if (event.ctrlKey && event.keyCode === 76) {
            this.props.terminal.clearInvocations();

            event.stopPropagation();
            event.preventDefault();
        }

        // Cmd+D.
        if (event.metaKey && event.keyCode === 68) {
            window.DEBUG = !window.DEBUG;

            event.stopPropagation();
            event.preventDefault();
            this.forceUpdate();
            console.log(`Debugging mode has been ${window.DEBUG ? 'enabled' : 'disabled'}.`);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.invocations.length != nextState.invocations.length
            || this.state.vcsData != nextState.vcsData;
    },
    render() {
        var invocations = this.state.invocations.map(invocation => {
            return (
                <Invocation key={invocation.id} invocation={invocation}/>
            )
        });

        return (
            <div className="terminal" onKeyDown={this.handleKeyDown}>
                <div className="invocations">{invocations}</div>
                <StatusLine currentWorkingDirectory={this.props.terminal.currentDirectory}
                            vcsData={this.state.vcsData}/>
            </div>
        );
    }
});
