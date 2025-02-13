import { useState, useContext } from 'react';
import UserContext from '../components/UserContext';
import moment from 'moment'
import Race from '../components/Race';
import styles from './Races.module.scss'
import layoutStyles from '../components/Layout.module.scss';

const Races = (props) => {
	const { timezone } = useContext(UserContext)
	const races = props.races
	
	// TODO Improve this isNextRace logic
	var isNextRace = false
	var nextRace = null
	
	return (
	<div className={styles.races}>
	  <h2 className={layoutStyles.heading}>F1 Schedule 2020</h2>
	  
	  <div className={styles.notice}>
	    Dates below are likely to change once a revised 2020 calendar is confirmed. <a href="https://www.formula1.com/en/latest/article.f1-schedule-2020-latest-information.3P0b3hJYdFDm9xFieAYqCS.html" target="_blank">Latest News</a>.
    </div>
	  
		<table id="events-table">
			<thead>
				<tr className={styles.tableHead}>
					<th scope="col" className="icon-column"></th>
					<th scope="col" className="event-column">Formula 1 Grand Prix Events {props.year}</th>
					<th scope="col" className="date-column">Date</th>
					<th scope="col" className="time-column">Time</th>
				</tr>
			</thead>
			
			{races.map((item, index) => {
  			isNextRace = false
				if(item.sessions && moment(item.sessions.race).isAfter() && !nextRace && !item.canceled && !item.tbc){
					isNextRace = true
					nextRace = item
				} 
				return (<Race item={item} index={index} timezone={timezone} key={item.slug} isNextRace={isNextRace} />)
			})}   
	    </table>
	</div>
	);
};

export default Races;