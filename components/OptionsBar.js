import { useState, useContext } from 'react';
import UserContext from '../components/UserContext';
import Link from 'next/link';
const moment = require('moment-timezone')
import styles from './OptionsBar.module.scss'

class OptionsBar extends React.Component {
	static contextType = UserContext
	
	constructor(props) {
	   super(props)
	   
	   this.state = {
	       pickerShowing: true
	   }
	}
	
	componentDidMount() {
		this.setState({
			pickerShowing: false
		})
	}
	
    onChange = event => { 
	    this.context.setTimezone(event.target.value);
	}
    
    togglePicker = event => { 
	    event.preventDefault()
	    
	    this.setState({
			pickerShowing: !this.state.pickerShowing
		})
	}
	
	
	render() {	
		// Picker Items
		const timezoneItems = []
	    
    const scrubbedPrefixes = ['Antarctica', 'Arctic', 'Canada', 'Chile', 'Etc', 'Mexico', 'US'];
		const scrubbedSuffixes = ['ACT', 'East', 'Knox_IN', 'LHI', 'North', 'NSW', 'South', 'West'];

		const tzNames = moment.tz.names()
        .filter(name => name.indexOf('/') !== -1)
        .filter(name => !scrubbedPrefixes.includes(name.split('/')[0]))
        .filter(name => !scrubbedSuffixes.includes(name.split('/').slice(-1)[0]));
	    
	    tzNames.reduce((memo, tz) => {
				memo.push({
					name: tz,
					offset: moment.tz(tz).utcOffset()
				});
		
				return memo;
			}, [])
			.sort((a, b) => {
				return a.offset - b.offset
			})
			.reduce((memo, tz) => {
				const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';
		
				timezoneItems.push(<option value={tz.name} key={tz.name}>(GMT{timezone}) {tz.name.replace("_", " ")}</option>);
			}, "");
			
		return (
			<div className={styles.options}>
				<div className={styles.bar}>
					{this.state.pickerShowing ?
						<div className={styles.picker}>
							<form action="/" method="GET">
								<label htmlFor="timezone" className={styles.pickerLabel}>Pick a timezone...</label>
								
								<select id="timezone" onChange={this.onChange} name="timezone" value={this.context.timezone}>
									{timezoneItems}
								</select>
								
								<button onClick={this.togglePicker} type="submit">Done</button>
							</form>
						</div>	
					:
						<div className={styles.options}>
							<div className={styles.currentTimezone}>
								<a onClick={this.togglePicker}>
									Showing times for <strong>{this.context.timezone && this.context.timezone.replace("_", " ")}</strong>.
								</a>
							</div>
							{ this.props.showCalendarExport &&
							<div className={styles.calendarLink}>
								<a href="/generate">Add these race dates & times to your mobile, calendar, Outlook or Google Calendar</a>
							</div>
							}
						</div>
			        }	
				</div>
				
				
				<div className={styles.mobileCalendarLink}>
					<a href="/generate">Add these race dates & times to your mobile, calendar, Outlook or Google Calendar</a>
				</div>
			</div>
		);
	}
}

export default OptionsBar