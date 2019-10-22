import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import CVEs from '../Dto/CVEs';

const CveItems = (props) => (
  <tbody>
    {
      props.cves.map( (cve) =>
        <tr key={cve.id} onClick={() => props.onSelect(cve)} >
          <td class="single line">
          <div class="ui link items">
          <div class="item"><a>
              {cve.id}
          </a></div></div>
          </td>
          <td class="single line">
            {cve.cvss}
          </td>
          <td class="single line">
            {CVEs.formatDate(cve.Modified)}
          </td>
          <td class="single line">
            {CVEs.formatDate(cve.Published)}
          </td>
          <td>{cve.summary.substring(0,100) + "..."}</td>
        </tr>
      )
    }
  </tbody>
)

/**
 *
 * Receives list of CVEs to display on one page.
 *
 * @author Alexander Koderman <attacksurface@koderman.de>
 * @export
 * @class CveList
 * @extends {Component}
 */
export default class CveList extends Component {

    static propTypes = {
        selectedCvesPage: PropTypes.array.isRequired,
        numTotalPages: PropTypes.number.isRequired,
        numCurrentPage: PropTypes.number.isRequired,
        onPaginationChange: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        numTotalCves: PropTypes.number.isRequired
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

    handlePrev10PageClick= () => {
        if (this.props.numCurrentPage > 1) {
            this.props.onPaginationChange( Math.max(this.props.numCurrentPage-10, 1) );
        }
    }

    handleNext10PageClick= () => {
        if (this.props.numCurrentPage < this.props.numTotalPages) {
            this.props.onPaginationChange( Math.min(this.props.numCurrentPage+10, this.props.numTotalPages) );
        }
    }

    handleFirstPageClick= () => {
        if (this.props.numCurrentPage > 1) {
            this.props.onPaginationChange(1);
        }
    }

    handleLastPageClick= () => {
        if (this.props.numCurrentPage < this.props.numTotalPages) {
            this.props.onPaginationChange(this.props.numTotalPages);
        }
    }

    handleSelect = (cve) => {
      this.props.onSelect(cve);
    }



    render () {
        return(
          <React.Fragment>
               <div className='ui field'>
                     <div className="ui positive button"
                          data-tooltip="Save this list as an Excel file."
                          onClick={this.props.onSaveClick} >
                         Export as .xlsx</div>
                </div>

                <table className="ui selectable celled table">
                <thead>

                <tr><th colSpan="6">
                    <div className="ui label">Inventory matches {this.props.numTotalCves} vulnerabilities: </div>
                     <div className="ui right floated pagination menu">
                         <a onClick={this.handleFirstPageClick} className={this.props.numCurrentPage>1 ? "icon item" : "disabled icon item"}>
                           <i className="fast backward  icon"  ></i>
                         </a>
                         <a onClick={this.handlePrev10PageClick} className={this.props.numCurrentPage > 1 ? "icon item" : "disabled icon item"}>
                           <i className="backward icon"  ></i>
                         </a>
                         <a onClick={this.handlePrevPageClick} className={this.props.numCurrentPage>1 ? "icon item" : "disabled icon item"}>
                           <i className="chevron circle left icon"  ></i>
                         </a>
                         <a className="disabled icon item">
                           {"Page " + this.props.numCurrentPage + "/" + this.props.numTotalPages}
                         </a>
                         <a onClick={this.handleNextPageClick} className={this.props.numCurrentPage < this.props.numTotalPages
                                 ? "icon item" : "disabled icon item"}>
                           <i className="chevron circle right icon" ></i>
                         </a>
                         <a onClick={this.handleNext10PageClick} className={this.props.numCurrentPage < this.props.numTotalPages
                                 ? "icon item" : "disabled icon item"}>
                           <i className="forward  icon" ></i>
                         </a>
                         <a onClick={this.handleLastPageClick} className={this.props.numCurrentPage < this.props.numTotalPages
                                 ? "icon item" : "disabled icon item"}>
                           <i className="fast forward  icon" ></i>
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
                </tr></thead>
                    <CveItems
                        cves={this.props.selectedCvesPage}
                        onSelect={this.handleSelect}
                    />
              </table>
              </React.Fragment>
        );
    }
}