import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../style/PastProposals.css';

const Pastproposals = ({ state }) => {
  const [views, setView] = useState([]);
  const { contract } = state;

  useEffect(() => {
    const viewMessage = async () => {
      const views = await contract.getCompletedProposals();
      console.log(views);
      setView(views);
    };
    contract && viewMessage();
  }, [contract]);

  const yesProposal = async (id) => {
    const { contract } = state;
    contract.voteForProposal(id, YES);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <h1>Past Proposals</h1>
        {views.map((view) => (
          <div key={view.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
              <h5 className="card-title">Name: {view.name}</h5>
                <p className="card-text">Description: {view.description}</p>
                <p className="card-text">Owner: {view.owner}</p>
                <p className="card-text">Vote Count: {parseInt(view.voteCount)}</p>
                <p className="card-text">Voted Yes: {parseInt(view.votedYes)}</p>
                <p className="card-text">Voted No: {parseInt(view.votedNo)}</p>
                {/* <p className="card-text">Voting Period: {parseInt(view.votingPeriod)}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pastproposals;
