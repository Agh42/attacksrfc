import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

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

/**
 *
 *
 * Receives list of CVEs to display on one page.
 * 
 * @author Alexander Koderman <attacksurface@koderman.de>
 * @export
 * @class CveList
 * @extends {Component}
 */
export default class CveList extends Component {



    static PropTypes = {
        selectedCvesPage: PropTypes.array.isRequired,
        numTotalPages: PropTypes.number.isRequired,
        numCurrentPage: PropTypes.number.isRequired,
        onPaginationChange: PropTypes.func.isRequired,
    };

   

    handlePrevPageClick = () => {
        if (this.props.numCurrentPage > 1) { 
            this.props.onPaginationChange(this.props.numCurrentPage-1);
        }
    }
    
    handleNextPageClick = () => {
        if (this.props.numCurrentPage < this.props.numTotalPages) {
            this.props.onPaginationChange(this.props.numCurrentPage+1);
        }
    }



    render () {
        return(
                
                <div className='ui raised segment'>
                    <div className='ui field'>
                         <div className="ui positive button" 
                              data-tooltip="Save this list as an Excel file."
                              onClick={this.props.onSaveClick} >
                             Save as .xlsx</div>
                    </div>
                <table className="ui sortable celled padded table">
                <thead>
                <tr><th colSpan="6">
                     <div className="ui right floated pagination menu">
                         <a className={this.props.numCurrentPage>1 ? "icon item" : "disabled icon item"}>
                           <i className="left chevron icon" onClick={this.handlePrevPageClick} ></i>
                         </a>
                         <a className="disabled icon item">
                           {"Page " + this.props.numCurrentPage + "/" + this.props.numTotalPages}
                         </a>
                         <a className={this.props.numCurrentPage < this.props.numTotalPages
                                 ? "icon item" : "disabled icon item"}>
                           <i className="right chevron icon" onClick={this.handleNextPageClick} ></i>
                         </a>
                     </div>
                </th></tr>
                </thead>
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
                  {this.props.selectedCvesPage.map( (cve) => {
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
              </table>
            </div>
        );
    }
}