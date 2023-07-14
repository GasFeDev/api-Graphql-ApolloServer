async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const forwarder = "0x36b2A537ad11c815b51Bd25E2DbC8213D84A4959";
    const burnERC721 = await ethers.getContractFactory("gsnERC721");
    const contract = await burnERC721.deploy(forwarder);
  
    console.log("Contract deployed at:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  