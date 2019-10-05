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

    handleCpeClick = () => {
        this.props.onClick(this.props.cpeSummary);
    }

    render() {
        let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest]
            = this.props.cpeSummary.cpe.id.split(":");

            return (
             <tbody>
             <tr onClick={this.handleCpeClick}>
                <td class="single line">
                    {this.props.cpeSummary.cpe.title}
                </td>
                <td class="single line">
                    { 'summary' in this.props.cpeSummary
                       && 'CRITICAL' in this.props.cpeSummary.summary
                        ? this.props.cpeSummary.summary.CRITICAL
                        : <i className="sync icon" />
                    }
                </td>
                 <td class="single line">
                  {'summary' in this.props.cpeSummary
                      && 'HIGH' in this.props.cpeSummary.summary
                        ? this.props.cpeSummary.summary.HIGH : "" }
                </td>
                 <td class="single line">
                  {'summary' in this.props.cpeSummary
                   && 'MEDIUM' in this.props.cpeSummary.summary
                        ? this.props.cpeSummary.summary.MEDIUM : "" }
                </td>
                 <td class="single line">
                  {'summary' in this.props.cpeSummary
                   && 'LOW' in this.props.cpeSummary.summary
                        ? this.props.cpeSummary.summary.LOW : "" }
                </td>
                 <td class="single line">
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
          <table className="ui sortable celled padded table">
                <thead>
                  <tr>
                  <th>Product</th>
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