const { Client, AccountBalanceQuery } = require("@hashgraph/sdk");
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

    // New Account Id
    const newAccountId = '0.0.2917633';

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
};
main();