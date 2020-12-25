import React from 'react'
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  render() {
    console.log('pureComponnet')
    return <h1>{this.props.obj.a}</h1>;
  }
}

export default App