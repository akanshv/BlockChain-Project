import React from 'react';
import "../style/Profile.css";
import { ethers } from "ethers";

const Profile = ({ state, account }) => {

    const createProposal = async (event) => {
        event.preventDefault();
        const { contract } = state;
        const name = document.querySelector("#Name").value;
        const description = document.querySelector("#Description").value;
        const votingPeriod = document.querySelector("#VotingPeriod").value;

        const creation = await contract.createProposal(name, description, votingPeriod);
        await creation.wait();
        console.log("Proposal Created");
    }

    const AddMember = async (event) => {
        event.preventDefault();
        const { contract } = state;
        const address = document.querySelector("#Add-Address").value;
        const addmember = await contract.addMember(address);
        await addmember.wait();
        console.log("Member Added");
    }

    const RemoveMember = async (event) => {
        event.preventDefault();
        const { contract } = state;
        const rmaddress = document.querySelector("#Rm-Address").value;
        const rmmember = await contract.removeMember(rmaddress);
        await rmmember.wait();
        console.log("Member Removed");
    }

    const completeProposal = async () => {
        const { contract } = state;
        contract.completeProposalVoting(1).wait();
        console.log("Proposal Completed");
    }

    const executeProposal = async () => {
        const { contract } = state;
        contract.execution(1).wait();
        console.log("Proposal Executed")
    }

    const RemoveProposal = async () => {
        const { contract } = state;
        contract.removeProposal(1).wait();
        console.log("Proposal Removed")
    }

    return (
        <div className="container mt-5">
            <p><b>Role:</b></p>
            <h3>Owner</h3>
            <p><b>Account:</b></p>
            <h3>{account[0]}</h3>

            <br></br>
            <br></br>
            
            <form onSubmit={createProposal} className="mt-4 border p-4">
                <h3> Create New Proposal</h3>
                <div className="mb-3">
                    <label htmlFor="Name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="Name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="Description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="Description" />
                </div>

                <div className="mb-3">
                    <label htmlFor="VotingPeriod" className="form-label">Voting Period in Days</label>
                    <input type="text" className="form-control" id="VotingPeriod" />
                </div>

                <button type="submit" className="btn btn-dark">Create Proposal</button>
            </form>

            <br></br>

            <div className="mt-4 border p-4">
                <h3>Faculty</h3>
                <hr></hr>
                <h6>Add Faculty</h6>
                <form onSubmit={AddMember}>
                    <div className="mb-3">
                        <label htmlFor="Add-Address" className="form-label">Member Address</label>
                        <input type="text" className="form-control" id="Add-Address" />
                    </div>

                    <button type="submit" className="btn btn-dark">Add Member</button>
                </form>
            </div>

            <br></br>

            <div className="mt-4 border p-4">
                <h3>Student</h3>
                <hr></hr>
                <h6>Add Student</h6>
                <form onSubmit={AddMember}>
                    <div className="mb-3">
                        <label htmlFor="Add-Address" className="form-label">Member Address</label>
                        <input type="text" className="form-control" id="Add-Address" />
                    </div>

                    <button type="submit" className="btn btn-dark">Add Member</button>
                </form>
            </div>

            <br></br>

            <div className="mt-4 border p-4">
                <h3>Remove Member</h3>
                <form onSubmit={RemoveMember}>
                    <div className="mb-3">
                        <label htmlFor="Rm-Address" className="form-label">Member Address</label>
                        <input type="text" className="form-control" id="Rm-Address" />
                    </div>

                    <button type="submit" className="btn btn-dark">Remove Member</button>
                </form>
            </div>

            <br></br>

            <div className="mt-4 border p-4">
                <h3>Complete Proposal</h3>
                <button onClick={() => completeProposal()} className="btn btn-dark">completeProposal</button>
            </div>
            <div className="mt-4 border p-4">
                <h3>Execute Proposal</h3>
                <button onClick={() => executeProposal()} className="btn btn-dark">executeProposal</button>
            </div>
            <div className="mt-4 border p-4">
                <h3>Remove Proposal</h3>
                <button onClick={() => RemoveProposal()} className="btn btn-dark">RemoveProposal</button>
            </div>
        </div>
    )
}

export default Profile;
