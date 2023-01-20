import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, network } from "hardhat";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify";


const deployBox: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    //@ts-ignore
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Box...")

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Box contract Deployed ${box.address}`)


    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContractAt("Box", box.address);
    const transferOwnerTx = await boxContract.transferOwnership(
        timeLock.address
    );
    await transferOwnerTx.wait(1);

//verify TS
    //@ts-ignore
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, [])
    }
    log("Contract verified!!!")
}

export default deployBox;
deployBox.tags = ["all", "box"]
