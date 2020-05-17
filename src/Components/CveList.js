import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {CVEs, NEWSWORTHY, HOTTOPIC} from '../Dto/CVEs';
import ClipboardJS from "clipboard";


function noop() {
  return undefined;
}

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
            {
              cve.has_exploit
              ? <i class="red warning sign icon"></i>
              : ""
            }
            {
              CVEs.hasNews(cve)
              ? <i class="orange comments icon"></i>
              : ""
            }
            {
              CVEs.hasNews(cve) === HOTTOPIC
              ? <i class="red fire icon"></i>
              : ""
            }
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
        numTotalCves: PropTypes.number.isRequired,
        _status: PropTypes.string.isRequired
    };

    componentDidMount(){
        var btn = document.getElementById('export-cvepage-btn');
        this.clipboard = new ClipboardJS(btn);
        this.clipboard.on('success', function(e) {
            console.log(e);
            // todo show copied tooltip
        });
        this.clipboard.on('error', function(e) {
            console.log(e);
            // show error tooltip
        });
    }

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
    
    handleSaveClick =() => {
        this.props.onSave();
    } 



    render () {
        return(
          <React.Fragment>
               <div className='ui field'>
               {
                    {
                        READY: (
                            <div className="ui positive button" id="export-cvepage-btn"
                              data-clipboard-target="#cveListTable"
                              data-tooltip="Copy to clipboard."
                              data-position="bottom center"
                              onClick={this.handleSaveClick} >
                              Copy to clipboard</div>
                        ),
                        SAVED: (
                            <div className="ui disabled button" id="export-cvepage-btn"
                              data-clipboard-target="#cveListTable"
                              data-tooltip="Copy to clipboard."
                              data-position="bottom center"
                              onClick={noop} >
                            Copied to clipboard!</div>
                        ),
                    }[this.props._status]
               }
                     
                </div>


                <table className="ui selectable celled table" id="cveListTable">
                <thead>

                <tr><th colSpan="6">
                    <div className="ui label">Filters match {this.props.numTotalCves} vulnerabilities: </div>
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