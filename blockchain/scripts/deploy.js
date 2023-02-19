const hre = require("hardhat");

async function main() {

  const DonationPage = await hre.ethers.getContractFactory("DonationPage");
  const donationPage = await DonationPage.deploy();

  await donationPage.deployed();

  console.log(
    `Our contract has been deployed to ${donationPage.address}!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
