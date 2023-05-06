const {expect} = require("chai")
const {ethers} = require("hardhat");

describe("Task contact",function(){
    let TaskContract;
    let taskContract;
    let owner;

    const NUM_TOTAL_TASK =5;

    let totalTasks;

    beforeEach(async function(){
        TaskContract = await ethers.getContractFactory("TaskContract");
        [owner] = await ethers.getSigners();
        taskContract = await TaskContract.deploy();

        totalTasks = [];

        for(let i=0;i<NUM_TOTAL_TASK;i++){
            let task = {
                "taskText":"Task number :"+ i,
                "isDeleted": false
            }

            await taskContract.addTask(task.taskText,task.isDeleted);

            totalTasks.push(task);
        }

    });

    describe("Add task", function(){
        it("Should emit addTask event",async function(){
            let task = {
                "taskText":"New task",
                "isDeleted": false
            }
    
            await expect(await taskContract.addTask(task.taskText,task.isDeleted)).to.emit(taskContract,"AddTask").withArgs(owner.address,NUM_TOTAL_TASK);
        });
    });

    describe("Get all tasks",function(){
        it("Return the correct number of task",async function(){
            const totalTask = await taskContract.getMyTasks();
            console.log(totalTask)
            expect(totalTask.length).to.equal(NUM_TOTAL_TASK);
        })
    })

    describe("Delete task",function(){
        it("Detele the task",async function(){
            const task_id =0;
            const task_isDelete = true;

            await expect(taskContract.deleteTask(task_id,task_isDelete)).to.emit(
                taskContract,"DeleteTask"
            ).withArgs(
                task_id,task_isDelete
            );
        })
    })

})
