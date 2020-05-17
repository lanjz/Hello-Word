import React from 'react'

function HotComponet(Com) {
    return class extends React.Component {
        constructor(props){
            super(props)
            this.state = {
                type: 'noHot'
            }

        }
        componentDidMount() {
            setTimeout(() => {
                this.setState({
                    type: 'hoc'
                })
            })
            console.log('this', 'HOc')
        }
        render(){
            return <Com {...this.props} type={this.state.type}></Com>
        }
    }

}
class App extends React.Component{
    render() {
        return (
            <div>Hoc: {this.props.type}</div>
        )
    }
}

export default HotComponet(App)