import React, { useEffect, useState } from 'react'
import "./App.css"
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import {TaskContractAddress} from "./config"
import TaskAbi from "./utils/artifacts/contracts/TaskContract.sol/TaskContract.json"
import { ethers } from 'ethers';

function App() {
    const [tasks,setTasks] = useState([]);
    const [input,setInput] = useState("");
    const [currentAccount,setCurrentAccount] = useState('')
    const [connectionNewtork,setConnectionNetwork] = useState(false);

    const connectWallet = async()=>{
        try{
            const {ethereum} = window

            if(!ethereum){
                alert("Metamask not detacted");
                return;
            }

            let chainId = await ethereum.request({method:"eth_chainId"})
            const hardHatChainId = "0x539";
            if(chainId != hardHatChainId){
                setConnectionNetwork(false);
                return;
            }else{
                setConnectionNetwork(true);
                getTaskList();
            }

            const account = await ethereum.request({method:"eth_requestAccounts"})
            setCurrentAccount(account[0]);

        }catch(error){
            console.log(error)
        }
    }

    const getTaskList = async () =>{
        try{
            const {ethereum} = window
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const TaskContract = new ethers.Contract(
                    TaskContractAddress,
                    TaskAbi.abi,
                    signer
                )
                if(TaskContract != null && TaskContract != undefined){
                    let tempTasks = await TaskContract.getMyTasks();
                    setTasks(tempTasks)
                }
            }
        }catch(expection){
            console.log(expection)
        }
    }

    const saveData = () =>{
        console.log("start")
        let temp = {
            "taskText":input,
            "isDeleted":false
        }
        try{
            const {ethereum} = window
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const TaskContract = new ethers.Contract(
                    TaskContractAddress,
                    TaskAbi.abi,
                    signer
                )

                TaskContract.addTask(temp.taskText,temp.isDeleted)
                .then(response=>{
                    setTasks([...tasks,temp]);
                    getTaskList();
                })
                .catch(error=>{
                    console.log(error);
                });
            }

        }catch(expection){

        }
    }

    const deleteTask = (id) =>{
        
        console.log("delete task")
        let temp = {
            "id":id,
            "isDeleted":true
        }
        try{
            const {ethereum} = window
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const TaskContract = new ethers.Contract(
                    TaskContractAddress,
                    TaskAbi.abi,
                    signer
                )

                TaskContract.deleteTask(temp.id,temp.isDeleted)
                .then(response=>{
                    setTasks([...tasks,temp]);
                    getTaskList();
                })
                .catch(error=>{
                    console.log(error);
                });
            }

        }catch(expection){

        }
    }

    useEffect(()=>{
        connectWallet();
        getTaskList();
    },[])

    return (
        <>
        <Navbar className='shadow py-2'>
            <Container>
                <Navbar.Brand href="#home">Do's</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className="App" onClick={connectWallet}>
            <div className="container shadow p-5 mt-5">
                <div className=" justify-content-between d-flex flex-wrap">
                    <h3>TODO Tasks</h3>
                    <h5>{(currentAccount)?<div className='text-break'>{currentAccount}</div>:<><button onClick={connectWallet} className='btn btn-dark'>Connect wallet</button></>}</h5>
                </div>
                <div className='my-4'>
                    <label htmlFor="task" className='my-2'>Enter task</label>
                    <textarea type="text" id='task' placeholder='Enter task' className="form-control" rows={2} onChange={(e)=>setInput(e.target.value)}>
                    
                    </textarea><br/>
                    <div className="w-100 d-flex">
                        <button onClick={saveData} className='ms-auto px-5 btn btn-success'>Save Task</button>
                    </div>
                </div>

                <h5 className='my-2'>Your Tasks</h5>
                <div className="d-flex justify-content-center">
                    <ul className='task-box'>
                        {
                            tasks.map(aa=>
                                {
                                    return <><li className="justify-content-center shadow mb-2 d-flex px-2 py-4">
                                        <div className=''>
                                            {aa.taskText}
                                        </div>
                                        <div onClick={()=>deleteTask(aa.id?._hex)} role="button" className="text-danger ms-auto text-weight-bold">
                                            Delete
                                        </div>
                                        </li></> 
                            })

                        }
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default App;
