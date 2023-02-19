import React from 'react'
import { useState, useEffect } from 'react'
import abi from "../utils/DonationPage.json"
import { ethers, utils } from "ethers";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';


const DonationPage = () => {
    const contractAddress = '0x48F12491741Da5CC9DC8AED53A625a97636F87D8' 
    const contractABI = abi.abi
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const donationPageContract = new ethers.Contract(contractAddress, contractABI, signer);
  
    const [yourWalletAddress, setYourWalletAddress] = useState("")
    const [walletConnected, setWalletConnected] = useState(false)
    const [walletAddressBalance, setWalletAddressBalance] = useState(0);
    const [contractOwnerAddress, setContractOwnerAddress] = useState("")
    const [isContractOwner, setIsContractOwner] = useState(false)
    const [totalDonations, setTotalDonations] = useState(0)
    const [numDonors, setNumDonors] = useState(0)
    const [inputDonationAmount, setInputDonationAmount] = useState({donationAmount: ""});
  
    const connectWallet = async () => {
      try {
          if (window.ethereum) {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
              const account = accounts[0];
              setYourWalletAddress(account);
              setWalletConnected(true);

              const rawBalance = await provider.getBalance(account)
              const balance = ethers.utils.formatEther(rawBalance)
              setWalletAddressBalance(balance)

              const owner = await donationPageContract.getOwnerOfContract()
              setContractOwnerAddress(owner);

              if (owner.toUpperCase() === account.toUpperCase()) {
                  setIsContractOwner(true)
              }

          } else {
              console.log("No account detected")
          }
          
      } catch (error) {
            console.log(error)
        }
    }

    const getTotalDonations = async () => {
        try {
            if (window.ethereum) {
                const totalDonations = await donationPageContract.getTotalDonations()
                setTotalDonations(ethers.utils.formatEther(totalDonations))                
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getNumDonors = async () => {
        try {
            if (window.ethereum) {
                const numDonors = await donationPageContract.getNumDonors()
                setNumDonors(numDonors)                
            }
        } catch (error) {
            console.log(error)
        }
    }

    const donate = async (donationAmount) => {
        try {
            if (window.ethereum) {
                const donate = await donationPageContract.donate(
                    {value: ethers.utils.parseEther(donationAmount)})
                await donate.wait() 
                alert("Donated!")
            }
        } catch (error) {
            alert(error)
        }
    }

    const withdrawFunds = async () => {
        try {
            if (window.ethereum) {
                const withdrawFunds = await donationPageContract.withdrawFunds()
                await withdrawFunds.wait() 
                alert("Withdrawed!")
            }
        } catch (error) {
            alert(error)
        }
    }


    const handleInputChange = (event) => {
        setInputDonationAmount(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
    } 

    useEffect(() => { 
        getTotalDonations();
        getNumDonors();
    }, [])

    return (
        <div>
            {!walletConnected ? (
                <div className='flex items-center justify-center'>
                    <button onClick={connectWallet} className="mt-8 py-2 px-4 hover:text-white font-bold rounded-lg bg-white hover:bg-gray-800 focus:outline-none focus:shadow-outline">
                        Connect your wallet
                    </button>
                </div>
            ) : (
                <div>
                    {!isContractOwner ? (
                        <div className='flex flex-col items-center justify-center mt-5'>
                            <p className='text-white'>The deployer / owner of this dapp is <span className='font-bold'>{contractOwnerAddress}</span></p>
                            <p className='text-light text-white'>Which means you won't be able to withdraw the funds from here 😀</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center mt-5'>
                            <h1 className='text-2xl text-white'>Welcome back, owner!</h1>
                            <button onClick={withdrawFunds} className="mt-4 py-2 px-4 text-black font-bold rounded-lg bg-emerald-400 hover:bg-emerald-700 focus:outline-none focus:shadow-outline">
                                Withdraw Funds
                            </button>
                        </div>
                
                    )}
                    <div className='flex flex-col items-center justify-center'>
                        <h3 className=' text-white text-2xl font-light mt-8'>
                            Total donations : {Math.round(totalDonations.toString() * 1000)/1000} ETH
                        </h3>
                        <h4 className='text-white text-2xl font-light py-1 mb-10'>
                            Number of donations : {numDonors.toString()}
                        </h4>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center px-10">
                        <div className="md:w-1/2 p-8">
                            <h2 className="text-3xl font-black mb-4 text-emerald-400">Donate to XXX charity!</h2>
                            <p className="text-lg text-white mb-2">
                            Donating to XXX charity can make a significant impact in supporting their mission to [insert mission of charity here].
                            By contributing even a small amount, you can help make a positive difference in the lives of those in need.
                            </p>
                            <div className='border-b border-gray-300 mt-5 mb-5' />
                            <div className='mb-5'>
                                <p className='text-white font-bold'>WALLET ADDRESS</p>
                                <span className='text-white font-light'>{yourWalletAddress}</span>
                                <h3 className='text-white text-2xl font-light mt-2'>Current balance : {Math.round(walletAddressBalance * 1000)/1000} ETH</h3>
                                <h3 className='text-white text-2xl font-light'>Remaining balance : {(Math.round(walletAddressBalance * 1000)/1000) - inputDonationAmount.donationAmount} ETH</h3>
                            </div>
                            <input 
                                type="number" 
                                className="bg-gray-100 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                                onChange={handleInputChange} 
                                name="donationAmount"
                                placeholder="Amount (in ETH)"
                                value={inputDonationAmount.donationAmount}
                            />
                            <button
                                onClick={() => donate(inputDonationAmount.donationAmount)}
                                className="bg-emerald-400 font-bold py-2 px-4 rounded-r hover:bg-emerald-700"
                            >
                            Donate!
                            </button>
                        </div>
                        <div className="md:w-1/2 flex items-center justify-center">
                            <img
                            className="w-96 h-96 rounded-lg"
                            src="https://images.unsplash.com/photo-1639843906796-a2c47fc24330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80"
                            alt="Example Image"
                            />
                        </div>
                    </div>
                    
                </div>
                
            )}
        </div>
       
    )
}

export default DonationPage