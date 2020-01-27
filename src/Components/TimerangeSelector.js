import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

const Range = Slider.Range;

// Range of days since 2002 (CVE start year)
const START_DATE = "2002-01-01";

function allDays() {
    var start = moment(START_DATE);
    var now = moment();
    return now.diff(start, "days");
}

              
/**
 *
 * Allows selection of a timerange with a slider widget.
 *
 * @author Alexander Koderman <attacksurface@koderman.de>
 * @export TimerangeSelector
 * @class 
 * @extends {Component}
 */
export default class TimerangeSelector extends Component {

    static propTypes = {
       onRangeChange: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        const days = allDays();
        this.state = {
                daysRange: [days-183,days], 
        }
    }
    
    sliderChange = (newRange) => {
        this.setState({
            daysRange: newRange
        }, () => {
            this.debounceChange();
        });
    }
    
    // Propagate no more than one state change per second:
    debounceChange() {
        const thisDebounce = this.debounce = setTimeout(() => {
            // If this is true, there is a newer event then this one, just return
            if (thisDebounce !== this.debounce) {
                return;
            }
            
            this.props.onRangeChange(
                this.toDateRange()
            );
        }, 500);
    }

    toDateRange() {
        return this.state.daysRange.map( (days) => {
            return moment(START_DATE).add(days, "days");
        });
    }
  
    render () {
        return(   
            <span>
                <Range 
                    min={0}
                    max={allDays()}
                    allowCross={false} 
                    defaultValue={this.state.daysRange} 
                    onChange={this.sliderChange} 
                    pushable={30}
                />
            
                <div  class="ui blue label" key="0">
                    {moment(START_DATE).add(this.state.daysRange[0], "days").format('YYYY-MM-DD')}
                </div>
                <i class="resize horizontal icon" />
                <div  class="ui blue label" key="1">
                    {moment(START_DATE).add(this.state.daysRange[1], "days").format('YYYY-MM-DD')}
                </div>

            </span>
        );
    }
}