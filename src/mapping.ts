import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  ERC20Token
} from "../generated/ERC20Token/ERC20Token";
import { Account, Token, Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  const blockTimestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const from = event.params.from;
  const to = event.params.to;
  const token = event.address;
  const value = event.params.value;

  // create token entity if it doesn't exist
  let tokenEntity = Token.load(token.toHex());
  if (tokenEntity == null) {
    let tokenContract = ERC20Token.bind(token);
    tokenEntity = new Token(token.toHex());
    const name = tokenContract.try_name();
    const symbol = tokenContract.try_symbol();
    const decimals = tokenContract.try_decimals();
    const totalSupply = tokenContract.try_totalSupply();
    tokenEntity.address = token.toHex();
    tokenEntity.name = name.reverted ? "unknown" : name.value;
    tokenEntity.symbol = symbol.reverted ? "unknown" : symbol.value;
    tokenEntity.decimals = decimals.reverted ? 18 : decimals.value;
    tokenEntity.totalSupply = totalSupply.reverted
      ? BigInt.fromI32(0)
      : totalSupply.value;
    tokenEntity.save();
  }

  // create transfer entity
  let transfer = new Transfer(txHash.concatI32(event.logIndex.toI32()));
  transfer.txHash = txHash.toHex();
  transfer.token = token.toHex();
  transfer.from = from.toHex();
  transfer.to = to.toHex();
  transfer.value = value;
  transfer.timestamp = blockTimestamp;
  transfer.save();

  // update account entities
  const fromAccount = getOrInitAccount(from);
  const toAccount = getOrInitAccount(to);
  fromAccount.updatedAt = blockTimestamp;
  toAccount.updatedAt = blockTimestamp;
  fromAccount.save();
  toAccount.save();
}

function getOrInitAccount(address: Address): Account {
  let account = Account.load(address.toHex());
  if (account == null) {
    account = new Account(address.toHex());
    account.address = address.toHex();
  }
  return account;
}
