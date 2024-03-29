import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import _ from 'lodash';

function MeetingList(props) {
	const { data, toggleAddTodo, toggleEditTodo, toggleDeleteTodo, setView, toggleStartMeeting, toggleStopMeeting } = props;
	const [title, setTitle] = useState('');
	const [editId, setId] = useState(null);
	const [time, startTime] = useState(0);

	useEffect(() => {
		if(data.start_time) {
			setInterval(() => startTime(moment(data.start_time).fromNow()), 1)
		}
	})

	function triggerStart(data) {
		if(!data.start_time) {
			toggleStartMeeting({ variables: { meetingTime: moment().format(), meetingID: data.id } })
			setInterval(() => startTime(moment().fromNow()), 1)
		} else {
			toggleStopMeeting({ variables: { meetingID: data.id }})
			setView('meeting')
		}
	}

	return (
		<Paper style={{position: 'relative', maxWidth: '80%', margin: '0px auto', paddingTop: 20}}>
			<Button
				style={{
					position: 'absolute',
					left: 10,
					top: 20
				}}
				onClick={() => setView('meeting')}>
				BACK
			</Button>

			{!data.start_time ? '' : <h2>{time}</h2>}
			<Button variant="contained" onClick={() => triggerStart(data)}>
				{!data.start_time ? 'START MEETING' : 'END MEETING'}
			</Button>
			<h1>TODO LISTS</h1>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<TextField 
					label='Title'
					value={title}
					onChange={e => setTitle(e.target.value)}
					style={{marginRight: 20}}
				/>
				{editId ? 
					<Button variant="contained" color="primary" onClick={() => {
						toggleEditTodo({ variables: { title: title, todoID: editId } })
						setTitle('')
						setId(null)
					}}>EDIT TODO</Button>
					:
					<Button variant="contained" onClick={() => {
						toggleAddTodo({ variables: { title: title, meetingID: data.id } })
						setTitle('')
					}}>ADD TODO</Button>
				}
			</div>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Title</TableCell>
						<TableCell>Completed</TableCell>
						<TableCell>EDIT</TableCell>
						<TableCell>DELETE</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				{_.map(_.sortBy(data.todos,['id'],['asc']), (data, idx) => {
					return(
					<TableRow key={idx} hover>
						<TableCell width="20%">{data.id}</TableCell>
						<TableCell width="20%">{data.title}</TableCell>
						<TableCell width="20%">{_.toString(data.is_completed)}</TableCell>
						<TableCell width="10%">
							<Button variant="contained" color="primary" onClick={() => {
								setId(data.id);
								setTitle(data.title)
							}}>
								EDIT
							</Button>
						</TableCell>
						<TableCell width="10%">
							<Button variant="contained" color="secondary" onClick={() => {
								toggleDeleteTodo({ variables: { id: data.id } });
							}}>
								DELETE
							</Button>
						</TableCell>
					</TableRow>
					)
				})}
				</TableBody>
			</Table>
		</Paper>
	);
}

export default MeetingList;
