// npx hardhat run scripts/disperse.ts

import "ethers";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { from, to, tokens } from "./addresses";
import { NonceManager } from "@ethersproject/experimental";

async function main() {
  const ERC20 = await ethers.getContractFactory("MockERC20");

  await Promise.all(tokens.map(async token => {

    const signers = new NonceManager(await ethers.getSigners());
    const signer = signers.find(_signer => _signer.address === from);

    if (!signer) throw Error("Can't sign the tx");

    const Token = ERC20.attach(token).connect(signer as any);
    const balance = await Token.balanceOf(from);

    if (balance.gt(0)) {
      console.log((await Token.transfer(to, balance, { gasPrice: 31 * 1e9 })).hash);
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