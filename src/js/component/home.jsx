import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState('');
	const [list, setList] = useState([]);
	const [taskHover, setTaskHover] = useState(null);

	let emptyTaskList = [{ "label": "No tasks, add a task", "done": false }]
	const [tasksListApi, setTasksListApi] = useState([
		{ "label": emptyTaskList.map(item => item.label).toString(), "done": false }
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

	/* Fetch the tasks list from the API and updates the local list state */
	useEffect(() => {
		fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa')
			.then(response => response.json())
			.then((data) => setList(data.map(item => item.label)))
			.catch(err => console.error(err))
	}, []);

	/*Updates the tasks list on the API when tasksListApi is modified*/
	useEffect(() => {
		fetch('https://playground.4geeks.com/apis/fake/todos/user/IlariaBa', {
			method: "PUT",
			body: JSON.stringify(tasksListApi),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log(resp.ok); // Will be true if the response is successful
				console.log(resp.status); // The status code=200 or code=400 etc.
				console.log(resp.text()); // Will try to return the exact result as a string
				return resp.json(); // (returns promise) Will try to parse the result as JSON and return a promise that you can .then for results
			})
			.then(data => {
				// Here is where your code should start after the fetch finishes
				console.log(data); // This will print on the console the exact object received from the server
			})
			.catch(error => {
				// Error handling
				console.log(error);
			});
	}, [tasksListApi]);

	const enterPressed = (e) => {
		if (e.key === "Enter") {
			let newTask = { "label": inputValue, "done": false };
			if (list.length === 1 && tasksListApi[0].label === emptyTaskList.map(item => item.label).toString()) {
				setTasksListApi([newTask])
				setList([newTask.label])
			}
			else {
				setTasksListApi([newTask, ...tasksListApi])
				setList(prevList => [inputValue, ...prevList]);
			}
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
		/*We can't send an empty array into the API*/
		let tasksListModified = [];
		if (list.length === 1) {
			tasksListModified = [{ "label": emptyTaskList.map(item => item.label).toString(), "done": false }];
		} else {
			listWithoutTask.map((task, index) => {
				let newTask = { "label": task, "done": false };
				tasksListModified.push(newTask);
			});
		}
		setTasksListApi(tasksListModified);
		setList(tasksListModified.map(item => item.label));
	}

	const deleteAll = () => {
		setTasksListApi(emptyTaskList);
		setList(emptyTaskList.map(item => item.label))
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
					{list.length === 1 && tasksListApi[0].label === emptyTaskList.map(item => item.label).toString() ?
						<li className="list-group-item fontSizeSmall">0 item left</li>
						:
						<li className="list-group-item fontSizeSmall">{list.length} item left</li>
					}
				</ul>
			</div>
			<div className="d-grid mt-2">
				<button className="btn btn-danger" type="button" onClick={() => deleteAll()}>
					Delete all
				</button>
			</div>
		</div>
	);
};

export default Home;
