import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from "clipboard";



/**
 * Single selectable CPE entry row.

 * CPE format is: cpe:cpeversion:type:vendor:product:version:update:edition
 *                :lang:sw_edition:target_sw:target_hw:other
 *
 */
class CpeSummaryItem extends React.Component {

    static propTypes = {
        key: PropTypes.string.isRequired,
        cpeSummary: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    sumCounts = (cpeSummary) => {
        let counts = Object.values(cpeSummary);
        return counts.reduce((a,b) => a+b, 0);
    }

    handleCpeClick = () => {
        this.props.onClick(this.props.cpeSummary);
    }

    render() {
        let  c,cpeversion,cpetype, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,cpetype, vendor, product, version, update, edition, lang, sw_edition, ...rest]
            = this.props.cpeSummary.cpe.id.split(":");

            return (
             <tbody>
             <tr onClick={this.handleCpeClick}>

                <td>
                    <div class="ui list">
                        <div class="ui item">
                            <i class={ {
                                    'o': "large server middle aligned icon",
                                    'a': "large keyboard middle aligned icon",
                                    'h': "large computer middle aligned icon",
                                }[cpetype]
                            }
                            ></i>
                            <div class="content">
                                <a class="header" onClick={this.handleCpeClick}>
                                    {this.props.cpeSummary.cpe.id}
                                </a>
                                <div class="ui description">
                                    {
                                        this.props.cpeSummary.cpe.title
                                        ? "(i.e. \"" + this.props.cpeSummary.cpe.title + "\")"
                                        : "(No detailed titles specified.)"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </td>

                <td class="center aligned">
                    { 'summary' in this.props.cpeSummary 
                    ? <div class="ui grey circular label">
                        {this.sumCounts(this.props.cpeSummary.summary)}
                        </div>
                    : ""    
                    }
                </td>

                <td class="center aligned">
                    { 'summary' in this.props.cpeSummary
                       && 'CRITICAL' in this.props.cpeSummary.summary
                        ? <div  class="ui red circular label">{this.props.cpeSummary.summary.CRITICAL}
                          </div>
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                      && 'HIGH' in this.props.cpeSummary.summary
                        ? <div class="ui red circular label">{this.props.cpeSummary.summary.HIGH}</div>
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                   && 'MEDIUM' in this.props.cpeSummary.summary
                        ? <div class="ui yellow circular label">{this.props.cpeSummary.summary.MEDIUM}
                          </div> 
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                   && 'LOW' in this.props.cpeSummary.summary
                        ? <div class="ui green circular label">{this.props.cpeSummary.summary.LOW}
                          </div> 
                        : "" }
                </td>
              </tr>
              </tbody>
            )};
}


/**
 * List of all searched and saved CPEs.
 *
 */
export default class SelectableCpeDetailsTable extends Component {

    static propTypes = {
        cpesWithCveCounts: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {
            _isLoading: false,
        }
     }
     
    componentDidMount(){
        var btn = document.getElementById('export-summaries-btn');
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

    render() {
        //component for cpe list:
        const selectableCpeItemList = this.props.cpesWithCveCounts.map((cpeWithCount) => (
            <CpeSummaryItem
                onClick={this.props.onSelect}
                cpeSummary={cpeWithCount}
                key={cpeWithCount.cpe.id}
            />
        ));

        return (
          <React.Fragment>
            <div className='ui field'>
                    <div className="ui positive button" id="export-summaries-btn"
                        data-clipboard-target="#cpeSummaryTable"
                        data-tooltip="Copy to clipboard."
                        data-position="bottom center"
                        onClick={this.props.onSaveClick} >
                        Copy to clipboard</div>
                </div>

            <table className="ui selectable striped table" id="cpeSummaryTable" >
                    <thead>
                    <tr class="center aligned">
                    <th>Product</th>
                    <th>Vulns.</th>
                    <th>Critical</th>
                    <th>High</th>
                    <th>Medium</th>
                    <th>Low</th>
                    </tr>
                    </thead>
                    {selectableCpeItemList}
            </table>
          </React.Fragment>
        );
    }
}