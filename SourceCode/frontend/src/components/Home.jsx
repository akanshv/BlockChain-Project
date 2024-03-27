import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const Home = ({ state }) => {
  const [views, setView] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const viewMessage = async () => {
      const views = await contract.getPendingProposals();
      console.log(views);
      setView(views);
    };
    contract && viewMessage();
  }, [contract]);

  const yesProposal = async (id) => {
    const { contract } = state;
    contract.voteForProposal(id, 0);
    console.log('Voted Yes');
  };

  const noProposal = async (id) => {
    const { contract } = state;
    contract.voteForProposal(id, 1);
    console.log('Voted No');
  };

  return (
    <div className="container mt-4">
      <h1>Active Proposals</h1>
      <div className="row">
        {views.map((view) => (
          <div key={view.id} className="col-md-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Name: {view.name}</h5>
                <p className="card-text">Description: {view.description}</p>
                <p className="card-text">Owner: {view.owner}</p>
                <p className="card-text">Vote Count: {parseInt(view.voteCount)}</p>
                <p className="card-text">Voted Yes: {parseInt(view.votedYes)}</p>
                <p className="card-text">Voted No: {parseInt(view.votedNo)}</p>
                {/* <p className="card-text">Voting Period: {parseInt(view.votingPeriod)}</p> */}
                <button
                  onClick={() => yesProposal(view.id)}
                  className="btn btn-dark mr-2"
                >
                  Yes
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  onClick={() => noProposal(view.id)}
                  className="btn btn-dark"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
