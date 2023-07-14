async function main() {
  const [deployer] = await ethers.getSigners();
  const total = 100000000;
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DDCoinERC20 = await ethers.getContractFactory("DDCoinERC20");
  const contract = await DDCoinERC20.deploy(total);

  console.log("Contract deployed at:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
