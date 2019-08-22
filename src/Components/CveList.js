import React, { Component } from 'react';
import moment from 'moment';


/**
 * getHostname()
 * Thanks for this function to:
 * @author Finn Westendorf
 * @param {any} url
 */
function getHostname(url) {
    var a = document.createElement("a");
    a.href = url;
    return a.hostname;
}

function formatDate(aDate) {
    let mom = moment(aDate);
    return mom.format('YYYY-MM-DD');
}

export default class CveList extends Component {
   
    render () {
        const cves = this.props.selectedCves;
        
        return(
                
                <div className='ui raised segment'>
                    <div className='ui field'>
                         <div className="ui positive button" 
                              data-tooltip="Save this list as an Excel file."
                              onClick={this.props.onSaveClick} >
                             Save as .xlsx</div>
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
                          <tr key={cve.id}>
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
                                      <div key={index} >
                                      <a href={reference} target="_blank">{getHostname(reference)}</a> 
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
                  <tr><th colSpan="5">
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