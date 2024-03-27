import { useState } from 'react'
import { useEffect } from 'react'
import {ethers} from "ethers"
import abi from "./contractJSON/LearnChain.json"
import {  Routes, Route, BrowserRouter} from 'react-router-dom';

import Home from './components/Home.jsx';
import PastProposals from './components/PastProposals.jsx'
import Profile from './components/Profile.jsx'
import './App.css'


function App() {

    const [state,setState] = useState({
        provider:null,
        signer:null,
        contract:null
    })

    const[account, setAccount] = useState("Not Connected")
    useEffect(()=>{
        const template=async()=>{
            const contractAddress="0x3bf546f4c6dfd73cf404786434773924bfb9695d";
            const contractABI=abi.abi;
            //MetaMask oart
            // 1. In order to do transaction on goerli testnet
            // 2. Metamask consist of infura api which actually help in connecting to the blockchain

            const {ethereum}=window;

            const account = await ethereum.request({
                method:"eth_requestAccounts"
            })

            setAccount(account)

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            console.log("Signer : ",signer)

            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            )
            console.log(contract)

            const result = await contract.uploadVideo('djbfsdk',10,"Aka",'description',true,false,false,false,false,false, {
                gasLimit: 100000
              });

            setState({provider,signer,contract});
        }
        template();
    },[])

    console.log()

    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home state={state}/>} />
            <Route path="/PastProposals" element={<PastProposals state={state}/>} />
            <Route path="/Profile" element={<Profile state={state} account={account}/>} />
        </Routes>
        </BrowserRouter>
        </>
    )
}

export default App