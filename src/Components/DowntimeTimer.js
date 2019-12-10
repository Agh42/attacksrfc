
export default class Timer extends Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.update(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }
  
  update(){
    this.forceUpdate();
    if (Date.now() - this.props.runningSince > 5) {
    }
  }
  
  renderCountdownString(){
    return now()-this.props.runningSince;
  }

render() {
    const countdownString = this.renderCountdownString(
      
    );
    return (
        {countdownString}
    )
}

