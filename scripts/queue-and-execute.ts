
import { ethers, network } from "hardhat";
import {
    developmentChains,
    FUNC,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    MIN_DELAY,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE];
    const box = await ethers.getContract("Box");
    console.log("Box ready")
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    const governor = await ethers.getContract("MyGovernor");
    console.log("Queueing...")

    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    console.log("Queue Processing....")
    queueTx.wait(1);
    console.log("Transaction queued")

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
    }
    console.log(("waiting for Minimum delay..."))

    console.log("Executing...")
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1);

    const boxNewValue = await box.retrieve();
    console.log(`New Box Value: ${boxNewValue.toString()}`);
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error)
    process.exit(1)
    });
