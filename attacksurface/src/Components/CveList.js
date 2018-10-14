import React, { Component } from 'react';



/**
 * getHostname()
 * by Kory Becker, http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript
 * @param {any} url
 */
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}
/**
 * getDomain()
 * by Kory Becker, http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript/
 * @param {any} url
 */
function getDomain(url) {
    var hostName = getHostName(url);
    var domain = hostName;
    
    if (hostName != null) {
        var parts = hostName.split('.').reverse();
        
        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
                
            if (hostName.toLowerCase().indexOf('.co.uk') !== -1 && parts.length > 2) {
              domain = parts[2] + '.' + domain;
            }
        }
    }
    
    return domain;
}

function formatDate(date) {
    const millis = new Date(date);
    const day = millis.getDate();
    const month = millis.getMonth();
    const year = millis.getFullYear();
    return `${year}-${month}-${day}`;
}

export default class CveList extends Component {
   
    render () {
        const cves = this.props.selectedCves;
        
        return(
                
                <div className='ui raised segment'>
                    <div className='ui field'>
                         <div className="ui positive button" 
                              data-tooltip="Save this list as an Excel file.">
                             Export to .xlsx</div>
                         <div className="ui  button" data-tooltip="Coming soon.">
                             Track mitigation by email...</div>
                         <div className="ui  button" data-tooltip="Coming soon.">
                             Track mitigation with JIRA...</div>
                         <div className="ui  button" data-tooltip="Coming soon.">
                             Track mitigation with Slack...</div>
                    </div>
                <table className="ui sortable celled padded table">
                <thead>
                  <tr>
                  <th>ID</th>
                  <th>Score</th>
                  <th>Modified</th>
                  <th>Published</th>
                  <th>Summary</th>
                  <th>References</th>
                </tr></thead>
                <tbody>
                  {cves.map( (cve) => {
                          return (
                          <tr>
                          <td class="single line">
                          <a href={"http://cve.mitre.org/cgi-bin/cvename.cgi?name="+cve.id} target="_blank">{cve.id}</a> 
                          </td>
                          <td class="single line">
                            {cve.cvss}
                          </td>
                          <td class="single line">
                            {formatDate(cve.Modified)}
                          </td>
                          <td class="single line">
                            {formatDate(cve.Published)}
                          </td>
                          <td>{cve.summary}</td>
                          <td class="right aligned">
                            {
                                cve.references.map( (reference, index) => {
                                    return (
                                      <div>
                                      <a href={reference} target="_blank">{getDomain(reference)}</a> 
                                      <br/>
                                      </div>
                                      );
                                })
                            }
                          </td>
                        </tr>  
                        );
                  })}
                </tbody>
                <tfoot>
                  <tr><th colspan="5">
                    <div className="ui right floated pagination menu">
                      <a className="icon item">
                        <i className="left chevron icon"></i>
                      </a>
                      <a className="item">1</a>
                      <a className="item">2</a>
                      <a className="item">3</a>
                      <a className="item">4</a>
                      <a className="icon item">
                        <i className="right chevron icon"></i>
                      </a>
                    </div>
                  </th>
                </tr>
                </tfoot>
              </table>
            </div>
        );
    }
}