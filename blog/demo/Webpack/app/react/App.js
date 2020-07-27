import React from 'react'
import Puc from './pages/class/PurC'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 , obj: {a: 2}};
  }
  componentDidMount() {
    this.setState({
      count: this.state.count++
    })
    const o = this.state.obj
    o.a = 3
    this.setState({
      obj: o
    })
    console.log(this)
  }

  render() {
    return <h1>
      {this.state.obj.a}
      <Puc obj={this.state.obj}></Puc>
    </h1>;
  }
}

export default App