
export default class DowntimeTimer extends Component {
  componentDidMount() {
    this.downSince = Date.now();
    this.forceUpdateInterval = setInterval(() => this.update(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }
  
  update() {
    this.forceUpdate();
  }
  
  renderDowntime  = () => {
    totalElapsed = Date.now() - this.runningSince;
    return millisecondsToHuman(totalElapsed);
  }

  millisecondsToHuman = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    const humanized = [
      pad(hours.toString(), 2),
      pad(minutes.toString(), 2),
      pad(seconds.toString(), 2),
    ].join(':');

    return humanized;
  }

  pad = (numberString, size) => {
    let padded = numberString;
    while (padded.length < size) padded = `0${padded}`;
    return padded;
  }

render() {
    return (
        <div className="ui item">
           <h4 className="ui left aligned inverted header">
               Uh oh - the website is down.
               <div className="sub header">
               The backend service is not responding fast enough. You can check <a target="_blank" href="">uptime robot</a> 
               to see if the site is down or <a target="_blank" href="">under heavy load</a>. Go to <a target="_blank" href="">the subreddit</a> to see
               if anyone else has problems. Or go to <a target="_blank" href="">the chat</a>and tell Alex about it. Now down since {this.renderDowntime}.
               </div>
           </h4>
        </div>
              
    )
}

