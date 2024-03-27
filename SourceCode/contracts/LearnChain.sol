// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/l/ERC20/ERC20.sol";l

contract LearnChain is ERC20 {

    // Pre-Requisite

    address private admin;
    uint256 private id;
    address[] public members; // List of members
    mapping(address => uint256) public balances; // Member balances

    enum VotedFor{YES, NO}

    struct Proposal{
        uint256 id;
        string name;
        string description;
        uint256 votedYes;
        uint256 votedNo;
        uint256 votingPeriod;
        address owner;
        uint256 voteCount;
        uint256 completedOn;
        bool isComplete;
        bool isExecuted;
    }
    mapping (uint => Proposal) public proposals;

    struct ProposalOwner{
        uint256 id;
        string name;
        address owner;
        bool isComplete;
    }
    mapping (address => ProposalOwner) public proposalOwner;

    struct VotedForId {
        uint[] votedIds;
    }
    mapping(address => VotedForId) votedId;

    constructor() ERC20("VotingToken", "VTK") {
        admin = msg.sender;
        members.push(msg.sender); // Admin is initially added as a member
        _mint(msg.sender, 100000000 * 10 ** ERC20.decimals());
    }

    // Functions :

    function createProposal(string memory _name, string memory _description, uint256 _votingWeakPeriod) external {
        require(proposalOwner[msg.sender].owner == address(0), "Can submit only one proposal at a time");
        id += 1;
        proposals[id].id = id;4
        proposals[id].name = _name;
        proposals[id].description = _description;
        proposals[id].votingPeriod = block.timestamp + (_votingWeakPeriod * 1 minutes);
        proposals[id].owner = msg.sender;
        proposalOwner[msg.sender] = ProposalOwner(id, _name, msg.sender, false);
    }

    function getExponentialCost(address _member) public view returns (uint256) {
        uint256 totalCost = 0;

        // Calculate total exponential votes for the member across all proposals
        for (uint256 i = 1; i <= id; i++) {
            if (votedId[_member].votedIds.length > 0) {
                uint256 CostForProposal = votedId[_member].votedIds.length ** 2;
                totalCost += CostForProposal;
            }
        }

        return totalCost;
    }


    function voteForProposal(uint256 _proposalId, VotedFor _voteFor) external {
        require(_voteFor == VotedFor.YES || _voteFor == VotedFor.NO, "Only yes(0) or no(1) accepted");
        require(proposals[_proposalId].owner != address(0), "Proposal does not exist");
        require(proposals[id].votingPeriod > block.timestamp, "Voting period ended");

        bool hasVotedBefore = false;
        for (uint i = 0; i < votedId[msg.sender].votedIds.length; i++) {
            if (votedId[msg.sender].votedIds[i] == _proposalId) {
                hasVotedBefore = true;
                break;
            }
        }

        if (!hasVotedBefore) {
            votedId[msg.sender].votedIds.push(_proposalId);
            console.log(msg.sender);
            console.log(admin);
            approve(msg.sender, 10 * 10 ** ERC20.decimals());
            transferFrom(msg.sender, admin, 10 * 10 ** ERC20.decimals());
        }
        else{
            uint256 exponentialCost = 10 * getExponentialCost(msg.sender);
            console.log(msg.sender);
            console.log(admin);
            approve(msg.sender, exponentialCost * 10 ** ERC20.decimals());
            transferFrom(msg.sender, admin, exponentialCost * 10 ** ERC20.decimals());
        }

        votedId[msg.sender].votedIds.push(_proposalId);
        if(_voteFor == VotedFor.YES){   
            proposals[_proposalId].votedYes += 1;
        }else{
            proposals[_proposalId].votedNo += 1;
        }
        proposals[_proposalId].voteCount += 1;
    }

    function completeProposalVoting(uint256 _proposalId) external{
        require(proposals[_proposalId].owner == msg.sender || msg.sender == admin, "Only proposal creator or admin can mark complete");
        require(proposals[_proposalId].owner != address(0), "Proposal does not exist");
        require(proposals[id].votingPeriod < block.timestamp, "Voting period not ended yet");
        require(proposals[_proposalId].isComplete == false, "Proposal already marked complete");
        proposals[id].isComplete = true;
        proposals[_proposalId].completedOn = block.timestamp;
    }

    function proposalResult(uint256 _proposalId) external view returns(string memory){
        require(proposals[_proposalId].isComplete != false, "Proposal not completed yet");
        if(proposals[_proposalId].votedYes > proposals[_proposalId].votedNo) return("Proposal is accepted");
        else if(proposals[_proposalId].votedYes < proposals[_proposalId].votedNo) return("Proposal is Rejected");
        else return("Proposal Ties");
    }

    function execution(uint256 _proposalId) external {
        require(proposals[_proposalId].votedYes > proposals[_proposalId].votedNo, "Denied Proposal can't be executed");
        require(proposals[_proposalId].owner != address(0), "Proposal does not exist");
        require(proposals[_proposalId].isComplete != false, "Proposal is not completed yet");
        proposals[_proposalId].isExecuted = true;
    }

    function removeProposal(uint256 _proposalId) external {
        require(msg.sender == admin, "Only proposal creator or admin can remove");
        require(proposals[_proposalId].isComplete != false, "Proposal is not completed yet");
        delete proposals[_proposalId];
        delete proposalOwner[msg.sender];
    }

    function getCompletedProposals() external view returns (Proposal[] memory) {
        uint256 completedCount = 0;

        // Count the number of completed proposals
        for (uint256 i = 1; i <= id; i++) {
            if (proposals[i].isComplete) {
                completedCount++;
            }
        }

        Proposal[] memory completedProposals = new Proposal[](completedCount);
        uint256 index = 0;

        // Populate the completed proposals array
        for (uint256 i = 1; i <= id; i++) {
            if (proposals[i].isComplete) {
                completedProposals[index] = proposals[i];
                index++;
            }
        }

        return completedProposals;
    }

    function getPendingProposals() external view returns (Proposal[] memory) {
        uint256 pendingCount = 0;

        // Count the number of pending proposals (not completed)
        for (uint256 i = 1; i <= id; i++) {
            if (!proposals[i].isComplete) {
                pendingCount++;
            }
        }

        Proposal[] memory pendingProposals = new Proposal[](pendingCount);
        uint256 index = 0;

        // Populate the pending proposals array
        for (uint256 i = 1; i <= id; i++) {
            if (!proposals[i].isComplete) {
                pendingProposals[index] = proposals[i];
                index++;
            }
        }

        return pendingProposals;
    }

    // Function to Check is member
    function isMember(address _member) public view returns (bool) {
        for (uint256 i = 0; i < members.length; i++) {
            console.log(members[i]);
            if (members[i] == _member) {
                return true; // The address is a member
            }
        }
        return false; // The address is not a member
    }

    // Function to add a new member
    function addMember(address newMember) external {
        require(msg.sender == admin, "Only the admin can add members");
        require(!isMember(newMember), "Member already exists");
        //require(Controller.canPropose(newMember), "New member doesn't have proposal rights");
        members.push(newMember);
       // Transfer tokens to the newly added member
        uint256 initialBalance = 5000 * 10**decimals(); // Set an initial balance
        // IERC20(admin).approve(msg.sender,initialBalance);
        require(transfer(newMember,initialBalance), "Token transfer failed");
    }

    // Function to remove a member
    function removeMember(address memberToRemove) external {
        require(msg.sender == admin, "Only the admin can remove members");
        require(isMember(memberToRemove), "Member not found");
        // Additional checks can be added if necessary
        // if (memberToRemove != msg.sender) {
        //     // Only the admin can remove other members
        //     //require(Controller.canPropose(memberToRemove), "Member can't be removed due to proposal rights");
        // }
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == memberToRemove) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
        delete balances[memberToRemove]; // Remove member balance
    }

}