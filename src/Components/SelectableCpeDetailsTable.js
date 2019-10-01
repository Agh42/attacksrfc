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
        cpeSummary: PropTypes.object.iRequired,
        onClick: PropTypes.func.isRequired,
    };

    handleCpeClick = () => {
        this.props.onCpeClick(this.props.cpeSummary);
    }

    render() {
        let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
        [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest]
            = this.props.cpeSummary.cpe.id.split(":");

            return (
             <tbody>
             <tr onClick="{this.handleCpeClick()}">
                <td class="single line">
                    {this.props.cpeSummary.cpe.title}
                </td>
                <td class="single line">
                    {this.props.cpeSummary._isLoading
                        ? <i className="sync icon" />
                        : this.props.cpeSummary.criticalCount
                    }
                </td>
                 <td class="single line">
                  {this.props.cpeSummary._isLoading
                        ? this.props.cpeSummary.highCount : "" }
                </td>
                 <td class="single line">
                  {this.props.cpeSummary._isLoading
                        ? this.props.cpeSummary.mediumCount : ""}
                </td>
                 <td class="single line">
                  {this.props.cpeSummary._isLoading
                        ? this.props.cpeSummary.lowCount : ""}
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
                cpeSummary={cpeWithCount.count}
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