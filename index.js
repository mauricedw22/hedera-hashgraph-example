const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    // const myPublicKey = process.env.MY_PUBLIC_KEY;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generate(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(10000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    //Create the transfer transaction
    const transferTransactionResponse = await new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1500)) //Sending account
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(1500)) //Receiving account
    .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await transferTransactionResponse.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(myAccountId)
    .execute(client);

    console.log("The sender account balance after the transfer is: " + getNewBalance.hbars.toTinybars() +" tinybar.")

    //Check the new account's balance
    const getNewBalance2 = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

    console.log("The recipient account balance after the transfer is: " + getNewBalance2.hbars.toTinybars() +" tinybar.")

}
main();

/* (async() => {


})().catch(e => {

    console.log(e);

}); */