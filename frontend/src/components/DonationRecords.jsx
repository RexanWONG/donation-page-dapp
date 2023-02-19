import React from 'react'
import { useState, useEffect } from 'react'
import abi from "../utils/DonationPage.json"
import { ethers, utils } from "ethers";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const DonationRecords = () => {
    const contractAddress = '0x48F12491741Da5CC9DC8AED53A625a97636F87D8' 
    const contractABI = abi.abi
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const donationPageContract = new ethers.Contract(contractAddress, contractABI, signer);

    const eighteenDecimals = 1000000000000000000
    const [allDonorsList, setAllDonorsList] = useState([])

    const getAllDonors = async () => {
        try {
            if (window.ethereum) {
                const allDonors = await donationPageContract.getAllDonors()
                setAllDonorsList(allDonors)
                console.log("all donors : ", allDonors)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => { 
        getAllDonors();
    }, [])

    return (
        <div className='flex flex-col bg-black h-screen w-screen'>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-5xl text-emerald-400 font-black'>Donation Records ({allDonorsList.length})</h1>
                <div class="overflow-x-auto mt-10">
                    <table class="w-full border-collapse table-auto">
                        <thead>
                        <tr>
                            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4" />
                            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 font-bold text-white tracking-wider">Donor wallet address</th>
                            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 font-bold text-white tracking-wider">Amount donated (ETH)</th>
                            <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 font-bold text-white tracking-wider">Time of donation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allDonorsList.map((item) => (
                            <tr key={item.array} class="hover:bg-gray-800">
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <Jazzicon diameter={30} seed={jsNumberForAddress(item.donorAddress)} />
                                </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-white">{item.donorAddress}</td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-white text-center">{item.amount/eighteenDecimals}</td> 
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-white">{new Date(item.timestamp * 1000).toLocaleString()}</td> 
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>


                
            </div>
            
        </div> 
    )
}

export default DonationRecords