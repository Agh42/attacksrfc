import React, { Component } from 'react';

export default class RegisterPage extends Component {
    render() {
        return (
                <div className='ui raised segment'>
                  <div className="ui stackable three column divided center aligned grid">
                    <div className="column">
                      <h4 className="ui header">Basic</h4>
                      <p>Inventory Search</p>
                      <p>Limited requests per day</p>
                      <p>Ads and Captcha</p>
                      <div className="ui disabled button">Free</div>
                    </div>
                    <div className="column">
                      <h4 className="ui header">Professional</h4>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p>59,-€ billed monthly</p>
                      <p><b>29,-€</b> per month billed yearly</p>
                      <div className="ui positive button">Try 30 days for free</div>
                    </div>
                    <div className="column">
                      <h4 className="ui header">On-Premise / Private Cloud</h4>
                      <p>You get full access to our up-to-date Docker repository.</p>
                      <p>You'll have access to the same images we're running publicly, including the newest upstream builds and full history of previous versions.</p>
                      <p>Pull images to run in your local environment, AWS EC2 or other cloud provider of your choice.</p>
                      <p>Includes support and professional services to integrate AttackSurfe in your environment.</p>
                      <div className="ui positive button">Ask for Quote</div>
                    </div>
                  </div>
              </div>
        );
    }
}