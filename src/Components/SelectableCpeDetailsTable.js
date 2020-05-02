import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from "clipboard";

function noop() {
    return undefined;
  }

/**
 * Single selectable CPE entry row.

 * CPE format is: cpe:cpeversion:type:vendor:product:version:update:edition
 *                :lang:sw_edition:target_sw:target_hw:other
 *
 */
class CpeSummaryItem extends React.Component {

    static propTypes = {
        cpeSummary: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    sumCounts = (cpeSummary) => {
        return ('CRITICAL' in cpeSummary ? cpeSummary.CRITICAL : 0)
            + ('HIGH' in cpeSummary ? cpeSummary.HIGH : 0)
            + ('MEDIUM' in cpeSummary ? cpeSummary.MEDIUM : 0)
            + ('LOW' in cpeSummary ? cpeSummary.LOW : 0); 
        // let counts = Object.values(cpeSummary);
        // return counts.reduce((a,b) => a+b, 0);
    }

    sumExploitCounts = (cpeSummary) => {
        return ('CRITICAL_EXPLOITS' in cpeSummary ? cpeSummary.CRITICAL_EXPLOITS : 0)
        + ('HIGH_EXPLOITS' in cpeSummary ? cpeSummary.HIGH_EXPLOITS : 0)
        + ('MEDIUM_EXPLOITS' in cpeSummary ? cpeSummary.MEDIUM_EXPLOITS : 0)
        + ('LOW_EXPLOITS' in cpeSummary ? cpeSummary.LOW_EXPLOITS : 0); 
    }

    exploitWarningCounts = (cpeSummary) => {
        return "Critical: " + ('CRITICAL_EXPLOITS' in cpeSummary ? cpeSummary.CRITICAL_EXPLOITS : 0) + " / "
        + "High: " + ('HIGH_EXPLOITS' in cpeSummary ? cpeSummary.HIGH_EXPLOITS : 0) + " / "
        + "Medium: " + ('MEDIUM_EXPLOITS' in cpeSummary ? cpeSummary.MEDIUM_EXPLOITS : 0) + " / "
        + "Low: " + ('LOW_EXPLOITS' in cpeSummary ? cpeSummary.LOW_EXPLOITS : 0); 
    
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
                            <div class="ui image" 
                                data-tooltip={
                                    { // NISTIR 7695 part type:
                                        "o": "OS",
                                        "a": "App",
                                        "h": "HW"

                                    }[cpetype]
                                }
                            >
                                <i class={ {
                                        'o': "large terminal middle aligned icon",
                                        'a': "large desktop middle aligned icon",
                                        'h': "large microchip middle aligned icon",
                                    }[cpetype]
                                }
                                ></i>
                            </div>
                            
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
                        && this.sumExploitCounts(this.props.cpeSummary.summary) > 0
                    ?   <div class="ui basic compact tiny red icon button"
                            data-tooltip={
                                "Exploit warning: " 
                                + this.exploitWarningCounts(this.props.cpeSummary.summary)
                        }>
                            <i class="warning sign icon"></i>
                        </div>
                    : ""    
                    }
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
                        ? <div class="ui orange circular label">{this.props.cpeSummary.summary.HIGH}</div>
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
        onSave: PropTypes.func.isRequired,
        _status: PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.state = {
            _isLoading: false,
        }
     }
     
    componentDidMount(){
        console.log("mounted: " + this.props.cpesWithCveCounts);
        var btn = document.getElementById('export-summaries-btn');
        this.clipboard = new ClipboardJS(btn);
        this.clipboard.on('success', function(e) {
            console.log(e);
        });
        this.clipboard.on('error', function(e) {
            console.log(e);
        });
    }

    componentDidUpdate () {
        console.log("updated: " + this.props.cpesWithCveCounts);
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
                {
                    {
                        READY: (
                            <div className="ui positive button" id="export-summaries-btn"
                              data-clipboard-target="#cpeSummaryTable"
                              data-tooltip="Copy to clipboard."
                              data-position="bottom center"
                              onClick={this.props.onSave} >
                              Copy to clipboard</div>
                        ),
                        SAVED: (
                            <div className="ui disabled button" id="export-summaries-btn"
                              data-clipboard-target="#cpeSummaryTable"
                              data-position="bottom center"
                              onClick={noop} >
                            Copied to clipboard!</div>
                        ),
                    }[this.props._status]
               }
            </div>

            <table className="ui selectable striped table" id="cpeSummaryTable">
                    <thead>
                    <tr class="center aligned">
                    <th>Product</th>
                    <th>&nbsp;</th>
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