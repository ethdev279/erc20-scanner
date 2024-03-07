import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/USDC/USDC";
import { User, Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // create transfer entity
  let transfer = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  transfer.txHash = event.transaction.hash.toHex();
  transfer.from = event.params.from.toHex();
  transfer.to = event.params.to.toHex();
  transfer.value = event.params.value;
  transfer.timestamp = event.block.timestamp;
  transfer.save();

  // Check if it's a mint or burn or transfer
  if (event.params.to.toHex() == Address.zero().toHex()) {
    // burn
    let fromUser = getOrInitUser(event.params.from);
    fromUser.balance = fromUser.balance.minus(event.params.value);
    fromUser.updatedAt = event.block.timestamp;
    fromUser.save();
  } else if (event.params.from.toHex() == Address.zero().toHex()) {
    // mint
    let toUser = getOrInitUser(event.params.to);
    toUser.balance = toUser.balance.plus(event.params.value);
    toUser.updatedAt = event.block.timestamp;
    toUser.save();
  } else {
    // Otherwise, it's a transfer
    let fromUser = getOrInitUser(event.params.from);
    let toUser = getOrInitUser(event.params.to);
    fromUser.balance = fromUser.balance.minus(event.params.value);
    toUser.balance = toUser.balance.plus(event.params.value);
    fromUser.updatedAt = event.block.timestamp;
    toUser.updatedAt = event.block.timestamp;
    fromUser.save();
    toUser.save();
  }
}

function getOrInitUser(address: Address): User {
  let user = User.load(address.toHex());
  if (user == null) {
    user = new User(address.toHex());
    user.address = address.toHex();
    user.balance = BigInt.fromI32(0);
  }
  return user;
}
