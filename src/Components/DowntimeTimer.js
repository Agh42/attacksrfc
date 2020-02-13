import React, { Component } from 'react';

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
    let totalElapsed = Date.now() - this.downSince;
    return this.millisecondsToHuman(totalElapsed);
  }

  millisecondsToHuman = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    const humanized = [
      this.pad(hours.toString(), 2),
      this.pad(minutes.toString(), 2),
      this.pad(seconds.toString(), 2),
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
            <h4 className="ui left aligned header">
                Uh oh - the website is down.
                <div className="sub header">
                I cannot reach the backend service. You can check 
                <a target="_blank" rel="noopener noreferrer"  href="https://stats.uptimerobot.com/RMwRDtvPLw"> uptime robot </a> 
                to see if the site is down or <a target="_blank" rel="noopener noreferrer"  href="https://stats.uptimerobot.com/RMwRDtvPLw/783419130">under 
                 heavy load</a>. Go to 
                <a target="_blank" rel="noopener noreferrer"  href="https://www.reddit.com/r/CSTOOL_io"> the subreddit </a> to see
                if anyone else has problems. Or go to <a target="_blank" rel="noopener noreferrer"  href="https://discord.gg/5HWZufA">the chat</a> and tell Alex about it. 
                </div>
                <div className="sub header">
                If you cannot reach any of these sites, the world may be ending right now. Please check your surroundings for signs of 
                ongoing Apocalypse such as lightning, earthquake and blackening of the sun. Or go check if your wifi is down.
                </div>
                <div className="sub header">
                Now gone since {this.renderDowntime()}. I'll keep retrying...
                </div>

                
            </h4>
          </div>
                
      )
  }
}

