const ERC20_SELECTORS = Object.freeze({
  TRANSFER: "0xa9059cbb",
  APPROVE: "0x095ea7b3"
});
function isHex(value) {
  return typeof value === "string" &&
    /^0x(?:[0-9a-fA-F]{2})*$/.test(value);
}
function isAddress(value) {
  return typeof value === "string" &&
    /^0x[0-9a-fA-F]{40}$/.test(value);
}
function decodeAddress(word) {
  if (!/^[0-9a-fA-F]{64}$/.test(word)) return null;
  if (!/^0{24}$/i.test(word.slice(0, 24))) return null;
  return `0x${word.slice(24).toLowerCase()}`;
}
function decodeUint256(word) {
  if (!/^[0-9a-fA-F]{64}$/.test(word)) return null;
  return BigInt(`0x${word}`);
}
export function decodeTransaction(transaction) {
  if (
    !transaction ||
    typeof transaction !== "object" ||
    Array.isArray(transaction)
  ) {
    return { status: "UNKNOWN", reason: "INVALID_TRANSACTION" };
  }
  const { to, value = "0", data = "0x" } = transaction;
  if (
    typeof value !== "string" ||
    !/^(0|[1-9][0-9]*)$/.test(value)
  ) {
    return { status: "UNKNOWN", reason: "INVALID_NATIVE_VALUE" };
  }
  if (!isHex(data)) {
    return { status: "UNKNOWN", reason: "INVALID_CALLDATA" };
  }
  if (data === "0x") {
    if (!isAddress(to)) {
      return { status: "UNKNOWN", reason: "INVALID_NATIVE_RECIPIENT" };
    }
    return {
      status: "DECODED",
      operation: "NATIVE_TRANSFER",
      to: to.toLowerCase(),
      value: BigInt(value)
    };
  }
  if (data.length < 10) {
    return { status: "UNKNOWN", reason: "MALFORMED_SELECTOR" };
  }
  if (!isAddress(to)) {
    return { status: "UNKNOWN", reason: "INVALID_CONTRACT_ADDRESS" };
  }
  if (BigInt(value) !== 0n) {
    return { status: "UNKNOWN", reason: "UNEXPECTED_NATIVE_VALUE" };
  }
  const selector = data.slice(0, 10).toLowerCase();
  const args = data.slice(10);
  if (
    selector !== ERC20_SELECTORS.TRANSFER &&
    selector !== ERC20_SELECTORS.APPROVE
  ) {
    return { status: "UNKNOWN", reason: "UNSUPPORTED_SELECTOR" };
  }
  if (args.length !== 128) {
    return { status: "UNKNOWN", reason: "MALFORMED_ERC20_CALL" };
  }
  const address = decodeAddress(args.slice(0, 64));
  const amount = decodeUint256(args.slice(64, 128));
  if (!address || amount === null) {
    return { status: "UNKNOWN", reason: "INVALID_ERC20_ARGUMENT" };
  }
  return {
    status: "DECODED",
    operation:
      selector === ERC20_SELECTORS.TRANSFER
        ? "ERC20_TRANSFER"
        : "ERC20_APPROVE",
    token: to.toLowerCase(),
    spenderOrRecipient: address,
    amount
  };
}
