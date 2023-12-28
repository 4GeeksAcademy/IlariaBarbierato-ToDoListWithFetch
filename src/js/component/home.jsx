import { func } from "prop-types";
import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState('');
	const [list, setList] = useState([]);
	const [taskHover, setTaskHover] = useState(null);
	const [tasksListApi, setTasksListApi] = useState([
		{ "label": "Make the bed", "done": false },
		{ "label": "Walk the dog", "done": false },
		{ "label": "Do the replits", "done": false }
	]);

	/*Initialize the tasks list*/
	useEffect(() => {
		fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify([])
		})
			.then(response => response.json())
			.then()
			.catch(err => err)
	})

	/*Updates the tasks list on the API*/
	useEffect(() => {
		fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(tasksListApi),
		})
			.then(response => response.json())
			.then((data) => console.log(data))
			.catch(err => err)
	}, []);

	/* Fetch the tasks list from the API and updates the local list state */
	
	/* Si saco el useEffect se renderiza todo el tiempo pero asi logro que se actualice "list" por fuera de "enterPressed" por si demora el fetch en actualizar*/
	/*useEffect(() => {*/
		fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa')
			.then(response => response.json())
			.then((data) => setList(data.map(item => item.label)))
			.catch(err => err)
	/*}, []);*/
	

	const enterPressed = (e) => {
		if (e.key === "Enter") {
			let newTask = { "label": inputValue, "done": false };
			setTasksListApi([newTask, ...tasksListApi])
			console.log(tasksListApi)
			fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify([newTask, ...tasksListApi]),
			})
				.then(response => response.json())
				.then((data) => console.log(data))
				.catch(err => err)
			/* A veces funciona y a veces no, si demora en actualizarse recien en el segundo enter se carga en la lista*/
			/*fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa')
				.then(response => response.json())
				.then((data) => setList(data.map(item => item.label)))
				.catch(err => err)
			*/
			/* Así es como mejor funciona pero no estaría usando la API no?
			setList(list.concat([inputValue])); 
			*/
			setInputValue("")
		}
	}

	const deleteTask = (taskIndex) => {
		let listWithoutTask = []
		listWithoutTask = list.filter((task, index) => {
			if (index !== taskIndex) {
				return task
			}
		})
		
	}

	return (
		<div className="container mt-5">
			<h1 className="d-flex justify-content-center">todos</h1>
			<div className="card">
				<input type="text" value={inputValue} placeholder="What needs to be done?" onChange={(e) => setInputValue(e.target.value)} onKeyDown={enterPressed} className="card-header border border-0 ps-5" />
				<ul className="list-group list-group-flush">
					{list.map((task, index) =>
						<li className="list-group-item ps-5 d-flex" key={index} onMouseEnter={() => setTaskHover(index)} onMouseLeave={() => setTaskHover(null)}>
							<p className="me-auto mb-0">{task}</p>
							{taskHover === index ? <button className="redDeleteButton" onClick={() => deleteTask(index)}> x </button> : ""}
						</li>
					)}
					{list.length === 0 ? <li className="list-group-item ps-5 noTasks">No tasks, add a task</li> : ""}
					<li className="list-group-item fontSizeSmall">{list.length} item left</li>
				</ul>
			</div>
		</div>
	);
};

export default Home;
