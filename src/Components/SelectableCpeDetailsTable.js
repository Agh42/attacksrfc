import React, { Component } from 'react';
import PropTypes from 'prop-types';




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
                                        : "(No long titles specified.)"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </td>

                <td class="center aligned">
                    { 'summary' in this.props.cpeSummary 
                    ? <a class="ui grey circular label">
                        {this.sumCounts(this.props.cpeSummary.summary)}
                        </a>
                    : ""    
                    }
                </td>

                <td class="center aligned">
                    { 'summary' in this.props.cpeSummary
                       && 'CRITICAL' in this.props.cpeSummary.summary
                        ? <a class="ui red circular label">{this.props.cpeSummary.summary.CRITICAL}</a>
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                      && 'HIGH' in this.props.cpeSummary.summary
                        ? <a class="ui red circular label">{this.props.cpeSummary.summary.HIGH}</a>
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                   && 'MEDIUM' in this.props.cpeSummary.summary
                        ? <a class="ui yellow circular label">{this.props.cpeSummary.summary.MEDIUM}</a> 
                        : "" }
                </td>

                 <td class="center aligned">
                  {'summary' in this.props.cpeSummary
                   && 'LOW' in this.props.cpeSummary.summary
                        ? <a class="ui green circular label">{this.props.cpeSummary.summary.LOW}</a> 
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
          <table className="ui selectable striped table">
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
        );
    }
}