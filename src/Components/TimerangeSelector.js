import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

// Range of days since 2002 (CVE start year)

allDays() {
    var start = moment("2002-01-01");
    var now = moment();
    return now.diff(start, "days");
}




              
/**
 *
 * Allows selection of a timerange with a slider UX widget.
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
              setState({
                dateRange: value,
              });
              ...
            }
        };
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