const { Client, AccountBalanceQuery } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    const myAccountId = process.env.MY_ACCOUNT_ID;
    // const myPublicKey = process.env.MY_PUBLIC_KEY;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const newAccountId = '0.0.2917633';

    const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(myAccountId)
    .execute(client);

    console.log("The sender account balance after the transfer is: " + getNewBalance.hbars.toTinybars() +" tinybar.")

    const getNewBalance2 = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

    console.log("The recipient account balance after the transfer is: " + getNewBalance2.hbars.toTinybars() +" tinybar.")
};
main();