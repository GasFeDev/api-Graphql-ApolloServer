async function main() {
  const RichRhinos = await ethers.getContractFactory("RichRhinos");
  const gasPrice = await RichRhinos.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);
  const estimatedGas = await RichRhinos.signer.estimateGas(
    RichRhinos.getDeployTransaction()
  );
  console.log(`Estimated gas: ${estimatedGas}`);
  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await RichRhinos.signer.getBalance();
  console.log(
    `Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`
  );
  console.log(
    `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`
  );
  if (Number(deployerBalance) < Number(deploymentPrice)) {
    throw new Error("You dont have enough balance to deploy.");
  }
  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await RichRhinos.deploy();
  await myNFT.deployed();
  console.log("Contract deployed to address:", myNFT.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
