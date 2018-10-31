import React, { Component } from 'react';

export default class PricingPage extends Component {
    render() {
        return (
                <div className='ui raised segment'>
                  <div className="ui stackable three column divided center aligned grid">
                    <div className="column">
                      <h4 className="ui header">Free</h4>
                      <p>Inventory Search</p>
                      <p>Vulnerability Landscape</p>
                      <p>Limited requests (Captcha)</p>
                      <p>Financed by Ads</p>
                      <div className="ui disabled button">Free</div>
                    </div>
                    <div className="column">
                      <h4 className="ui header">Professional</h4>
                      <p>Unlimited usage</p>
                      <p>Save your inventory of assets</p>
                      <p>Unlimited email notifications</p>
                      <p>Alerts when new vulnerabilities for your asset inventory occur</p>
                      <p>Assign mitigation tasks using email / JIRA / Slack integration</p>
                      <p><b>29,-€ per month billed yearly</b>
                      <br/>59,-€ billed monthly</p>
                      <div className="ui positive button">Try 30 days for free</div>
                    </div>
                    <div className="column">
                      <h4 className="ui header">On-Premise / Private Cloud</h4>
                      <p>Run AttackSurface in your local data center</p>
                      <p>Run AttackSurface in any public or private cloud </p>
                      <p>Complete access to our Docker images</p>
                      <p>Support and professional services to integrate AttackSurface in your environment.</p>
                      <div className="ui positive button">Ask for Quote</div>
                    </div>
                  </div>
              </div>
        );
    }
}