import React, { useEffect, useRef, useState } from 'react'
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
    const [del,setDelete] = useState("");
    const [currentAccount,setCurrentAccount] = useState('')
    const [connectionNewtork,setConnectionNetwork] = useState(false);
    const windowSize = useRef([window.innerWidth, window.innerHeight]);

    const connectWallet = async()=>{
        try{
            const {ethereum} = window

            if(!ethereum){
                alert("Metamask not detacted");
                return;
            }

            let chainId = await ethereum.request({method:"eth_chainId"})
            const hardHatChainId = "0xaa36a7";
            if(chainId != hardHatChainId){
                if (window.ethereum) {
                    try {
                        // Switch the network to Sophia Testnet
                        await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: hardHatChainId }], // 0x2a is the hexadecimal chain ID for Sophia Testnet
                        });
                    } catch (error) {
                        console.log('Failed to switch network:', error);
                    }
                }
                setConnectionNetwork(false);
                return;
            }else{
                setConnectionNetwork(true);
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
                // await TaskContract.getMyTasks.map(data=>{
                //     console.log(data)
                // })
                if(TaskContract != null && TaskContract != undefined){
                    let tempTasks = await TaskContract.getMyTasks();
                    setTasks(tempTasks)
                }
                // setTasks([])
                // tempTasks.map(data=>{
                //     setTasks([...tasks,data]);
                // })
            }

        }catch(expection){
            console.log(expection)
        }
    }

    const saveData = () =>{
        console.log("start transaction")
        let temp = {
            "task":input,
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

                TaskContract.addTask(temp.task,temp.isDeleted)
                .then(response=>{
                    console.log(response)
                    setTasks([...tasks,temp]);
                    setInput("")
                })
                .catch(error=>{
                    console.log(error);
                });
            }

        }catch(expection){

        }
    }

    const deleteTask = () =>{
        console.log("delete transaction")
        let temp = {
            "taskId":del,
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

                TaskContract.deleteTask(temp.taskId,temp.isDeleted)
                .then(response=>{
                    console.log(response)
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
    },[])
    useEffect(()=>{
        setTimeout(() => {
            getTaskList();
          }, 2000);
    })

    function makeStringShort(s){
        if(windowSize.current[0] <450){
            return s.substring(0,6)+"..."+s.substring(s.length-5);
        }else{
            return s;
        }
    }

    return (
        <>
        <Navbar className='shadow py-2'>
            <Container>
                <Navbar.Brand href="#home">Your Todo List</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {(currentAccount)?makeStringShort(currentAccount):<><button onClick={connectWallet} className='btn btn-dark'>Connect wallet</button></>}
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <div className="App" onClick={connectWallet}>
            <div className="container p-2">
                <div className='app-inner rounded m-3 p-3'>
                    <h3 className=''>TODO Tasks</h3>
                    <div className='my-4'>
                        <label htmlFor="task" className='text-bold text-light my-2'>Enter task</label>
                        <input type="text" id='task' placeholder='Enter task' className="form-control" value={input} onChange={(e)=>setInput(e.target.value)}/><br/>
                        <div className="w-100 d-flex">
                            <button onClick={saveData} className='ms-auto px-5 btn btn-success'>Save Task</button>
                        </div>
                    </div>

                    <h5 className='my-2 text-light'>Your Tasks</h5>
                    <div className='d-flex row  justify-content-start'>
                        {
                            tasks.map(aa=>
                                {
                                    return <>
                                        <div className='col-sm-4  my-3'>
                                            <div class="card border-0  h-100 shadow rounded">
                                                <div class="card-body mx-3">
                                                    <p class="card-text">{aa.taskText}</p>
                                                </div>
                                                <div className='d-flex mb-2 me-2'>
                                                    <a href="#" class="btn rounded-pill btn-danger ms-auto" onClick={()=>{deleteTask();setDelete(aa.id)}}>Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </> 
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default App;
