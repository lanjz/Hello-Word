import React from 'react'

const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton"></button>
));
function Button() {
    return <button disabled>BUTTON</button>
}
class App extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }
    componentDidMount() {
        console.log('ref', this.ref.current)
    }
    render() {
        return (
            <FancyButton ref={this.ref}/>
        );
    }
}

export default App
