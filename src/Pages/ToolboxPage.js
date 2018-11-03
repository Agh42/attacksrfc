import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class ToolboxPage extends Component {
    render() {
        return (
                <React.Fragment>
                   <div class="ui middle aligned stackable grid container">
          <div class="row">
            <div class="sixteen wide column">
            
            
            <div class="ui centered cards">
            
              <div class="card">
                <div class="content">
                  <img class="ui image" src="/images/logos/as.png" />
                  <div class="centered header">AttackSrfc</div>
                  <span class="ui teal ribbon label">Vulnerability Management</span>
                  <div class="description">Start your vulnerability mitigation workflow with this tool. 
                  Make your vulnerability landscape visible to management. 
                  Involve necessary stakeholders to get rid of critical vulnerabilities - without having to roll out vulnerability scanners first.  </div>
                </div>
                <a href="/attacksrfc" class="ui bottom attached primary button">
                  <i class="play icon"></i>
                  Use
                </a>
              </div>
              
            <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              SpilledBns</div>
              <span class="ui orange ribbon label">Disclosure Monitoring</span>
              <div class="description">Domain discovery is being used against you by attackers right now. Start using it to protect your public web pages. Even the ones that you may not know about... </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
            
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              ControlMgr</div>
              <span class="ui yellow ribbon label">Compliance Management</span>
              <div class="description">The compliance manager will allow you to map your controls implementation against auditable best practices and standards.</div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              RiskMgr</div>
              <span class="ui olive ribbon label">Risk Management</span>
              <div class="description">
                  Use the risk manager to identify and evaluate information security risks. Show your risk register and dashboard to auditors and management.
         </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              AuditMgr</div>
              <span class="ui green ribbon label">Audit Tracking</span>
              <div class="description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              DataSrvy</div>
              <span class="ui blue ribbon label">Information Gathering</span>
              <div class="description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              AssetMgr</div>
              <span class="ui violet ribbon label">Asset Management</span>
              <div class="description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              DocumentMgr</div>
              <span class="ui purple ribbon label">Documentation</span>
              <div class="description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
             <div class="card">
            <div class="content">
              <img class="ui image" src="/images/logos/no_logo.png" />
              <div class="centered header">
              ResponsePlnr</div>
              <span class="ui pink ribbon label">Anomalies and Events</span>
              <div class="description">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </div>
            </div>
            <a href="/attacksrfc" class="ui bottom attached disabled button">
              <i class="play icon"></i>
              Activate
            </a>
            </div>
            </div>
      </div>
      </div>
      </div>
                </React.Fragment>
                );
    }
}