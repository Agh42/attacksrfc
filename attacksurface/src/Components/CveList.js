import React, { Component } from 'react';


export default class CveList extends Component {
   
    render () {
        const cves = this.props.selectedCves;
        
        return(
                
                <div className='ui raised segment'>
                    <div className='ui field'>
                         <div className="ui positive button" data-tooltip="Save this list as an Excel file.">
                             Export to .xlsx</div>
                         <div className="ui  button" data-tooltip="Coming soon.">
                             Track with JIRA...</div>
                         <div className="ui  button" data-tooltip="Coming soon.">
                             Track with Slack...</div>
                    </div>
                <table className="ui celled padded table">
                <thead>
                  <tr>
                  <th>ID</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Summary</th>
                  <th>References</th>
                </tr></thead>
                <tbody>
                  {cves.map( (cve) => {
                          return (
                          <tr>
                          <td class="single line">
                            {cve.id}
                          </td>
                          <td class="single line">
                            {cve.cvss}
                          </td>
                          <td>
                            {cve.Published}
                          </td>
                          <td>{cve.summary}</td>
                          <td class="right aligned">
                            {
                                cve.references.map( (reference, index) => {
                                    let num=index+1;
                                    return (
                                      <div>
                                      <a href={reference} target="_blank">{"[Ref-"+num+"]"}</a> 
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