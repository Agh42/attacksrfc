import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// Range of days since 2002 (CVE start year)

const startDate = "2002-01-01";

allDays() {
    var start = moment(startDate);
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
        this.state = {
                daysRange: [0,0], 
        }
    }

    componentDidMount(){
        const days = allDays();
        this.settings = {
            start: [days-183, days],
            min: 0,
            max: days,
            step: 1,
            onChange: value => {
                this.setState({
                    dateRange: value
                }, () => {
                    this.debounceChange();
                });
            }
        };
    }
    
    // Propagate no more than one state change per second:
    debounceChange() {
        const thisDebounce = this.debounce = setInterval(() => {
            // If this is true, there is a newer event then this one, just return
            if (thisDebounce !== this.debounce) {
                return;
            }
            
            this.props.onRangeChange(
                toDateRange(this.state.daysRange)
            );
        }, 1000);
    }

    toDateRange() {
        return this.state.daysRange.map( (days) => {
            
        });
    }
  
    render () {
        return(   
            <div className='ui raised segment'>
                <Slider multiple color="blue" settings={this.settings} />
            
                {dateRange.map((val, i) => (
                  <Label key={i} color="blue">
                    {val}
                  </Label>
                ))}
            </div>
        );
    }
}