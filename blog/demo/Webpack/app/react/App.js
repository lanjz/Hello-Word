import React from 'react'
import Puc from './pages/class/PurC'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 , obj: {a: 2}};
  }
  componentDidMount() {
    debugger
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (<h1>{this.state.count}</h1>)
  }
}

export default App