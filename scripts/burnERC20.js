async function main() {
  const [deployer] = await ethers.getSigners();
  const supply = "1000000000000000000000";
  const biggy = ethers.BigNumber.from(supply);
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const burnERC20 = await ethers.getContractFactory("BurnTokenERC20");
  const contract = await burnERC20.deploy(biggy);

  console.log("Contract deployed at:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
