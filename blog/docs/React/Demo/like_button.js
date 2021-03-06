'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, liked: 'liked' };
  }
  componentDidMount(){
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
  }
  updateCount(){

  }
  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.updateCount() },
      'Like'
    );
  }
}