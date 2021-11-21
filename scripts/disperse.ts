// npx hardhat run script.js

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import "ethers";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { from, to, tokens } from "./addresses";

async function main() {
  const ERC20 = await ethers.getContractFactory("MockERC20");

  await Promise.all(tokens.map(async token => {

    const signers = await ethers.getSigners();
    const signer = signers.find(_signer => _signer.address === from);

    if (!signer) throw Error("Can't sign the tx");

    const Token = ERC20.attach(token).connect(signer as any);
    const balance = await Token.balanceOf(from);

    if (balance.gt(0)) {
      console.log((await Token.transfer(to, balance)).hash);
    }

  }));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });