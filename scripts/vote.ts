import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config";
import * as fs from "fs";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";


const index = 0;

async function vote(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];
    //0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1; //Way we vote
    const governor = await ethers.getContract("MyGovernor");
    const reason = "In Favor of web3 development!"
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason //Reason for voting
    );
    await voteTxResponse.wait(1);

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }
    console.log("Vote completed succesfully!!!")
}

vote(index)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })