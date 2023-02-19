// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DonationPage {
    using SafeMath for uint256;
    
    address public owner;

    event Donated ( 
        address _donorAddress,
        uint256 _amount,
        uint256 _timestamp
    );

    struct Donor {
        address donorAddress;
        uint256 amount;
        uint256 timestamp;
    }

    Donor[] public donors;

    mapping(address => uint256) public totalDonations;

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        totalDonations[msg.sender] += msg.value;
        donors.push(Donor(msg.sender, msg.value, block.timestamp));

        emit Donated(msg.sender, msg.value,block.timestamp);
    }

    function getTotalDonations() public view returns (uint256) {
        uint256 total = 0;

        // Iterate over each donor in the donors array and add up their donations using the donations mapping
        for (uint i = 0; i < donors.length; i++) {
            total += totalDonations[donors[i].donorAddress];
        }

        return total;
    }

    function getAllDonors() public view returns (Donor[] memory) {
        Donor[] memory allDonors = new Donor[](donors.length);

        for (uint256 i = 0; i < donors.length; ++i) {
            Donor storage item = donors[i];
            allDonors[i] = item;
        }
        
        return allDonors;
    }

    function getNumDonors() public view returns (uint256) {
        return donors.length;
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only the contract owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    function getOwnerOfContract() public view returns (address) {
        return owner;
    }
}