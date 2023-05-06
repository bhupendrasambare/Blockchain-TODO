// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.4;

contract  TaskContract {

    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    struct Task {
        uint id;
        address username;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint256 =>address) taskOwner;

    function addTask(string memory taskTest, bool isDeleted)external{
        uint taskId = tasks.length;
        tasks.push(Task(taskId,msg.sender,taskTest,isDeleted));
        taskOwner[taskId] = msg.sender;
        emit AddTask(msg.sender,taskId);
    }

    function getMyTasks() view external returns (Task[] memory){
        Task[] memory temporary = new Task[](tasks.length);
        uint count =0;
        for(uint i=0;i<tasks.length;i++){
            if(taskOwner[i] == msg.sender && tasks[i].isDeleted == false){
                temporary[count] = tasks[i];
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        for(uint i=0;i<count;i++){
            result[i] = temporary[i];
        }

        return result;
    }


    function deleteTask(uint taskId, bool isDeleted) external{
        if(taskOwner[taskId] == msg.sender){
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId,isDeleted);
        }
    }

}