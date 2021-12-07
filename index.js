const algosdk = require('algosdk');
const MyAlgoConnect = require('@randlabs/myalgo-connect');
const myAlgoWallet = new MyAlgoConnect();

// Get token information from your node, sandbox, or third party API
const token = "API TOKEN GOES HERE"
const server = "http://localhost"
const port = 8080
const client = new algosdk.Algodv2(token, server, port);


document.getElementById('connection-status').onclick = () => {
    try {
        connectionStatus()
    } catch (e) {
        console.error(`[!] connection error: ${e}`)
    }
}

document.getElementById('create-account').onclick = () => {
    try {
        createAccount()
    } catch (e) {
        console.log("[!] error creating account: ", e)
    }
}

document.getElementById('payment').onclick = () => {
    try {
        payment()
    } catch (e) {
        console.error(`[!] payment error: ${e}`)
    }
}

let connection =  async () => {
    const node_connection_status = await client.status().do()
    console.log(node_connection_status)
}

function connectionStatus() {
    console.log('connection status: ')
    connection()
}


document.getElementById('payment').onclick = () => {
    try {
        payment()
    } catch (e) {
        console.error(`[!] payment error: ${e}`)
    }
}

document.getElementById('asset-transfer').onclick = () => {
    try {
        assetTransfer()
    } catch (e) {
        console.error(`[!] asset transfer error: ${e}`)
    }
}

async function payment() {
    console.log('payment')
    try {
        let params = await client.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;
        const receiver = "RECEIVER's ADDRESS GOES HERE";
        const enc = new TextEncoder();
        const note = enc.encode("Signing payment transaction using myAlgo");
        let amount = 1000000;
        // let closeout = receiver; //closeRemainderTo. set this only if you want all remaining balance in the sender's account sent to the receiver.
        let sender = "SENDER's ADDRESS GOES HERE";
        let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, note, params);
        let signedTxn = await myAlgoWallet.signTransaction(txn.toByte())
        let txId = txn.txID().toString();
        console.log(typeof(signedTxn))
        await client.sendRawTransaction(signedTxn.blob).do();

        // Wait for confirmation
        let confirmedTxn = await waitForConfirmation(client, txId, 4);
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        console.log("[+] Done");
    }
    catch (e) {
        console.log("[!] payment transfer failed. ", e);
    }
}

async function assetTransfer() {
    console.log('asset transfer transaction')
    try {
        let txnParams = await client.getTransactionParams().do();
        console.log("txnParams before setting: \n", txnParams)
        txnParams.flatFee = true
        txnParams.fee = 1000
        console.log("txnParams before setting: \n", txnParams)
        const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(
            {
                suggestedParams: txnParams,
                from: "SENDER's ADDRESS GOES HERE",
                to: "RECEIVER's ADDRESS GOES HERE",
                assetIndex: 00000000,
                amount: 10,
                note: new Uint8Array(Buffer.from('KUCH Coin')),
            }
        )

        let signedTxn = await myAlgoWallet.signTransaction(txn2.toByte())
        await client.sendRawTransaction(signedTxn.blob).do()
        console.log("[+] Done");
      } catch (e) {
        console.error(`[!] asset transfer failed. ${e}`);
      }
}

const waitForConfirmation = async function (client, txId, timeout) {
    if (client == null || txId == null || timeout < 0) {
        throw new Error("Bad arguments");
    }

    const status = (await client.status().do());
    if (status === undefined) {
        throw new Error("Unable to get node status");
    }

    const startround = status["last-round"] + 1;
    let currentround = startround;

    while (currentround < (startround + timeout)) {
        const pendingInfo = await client.pendingTransactionInformation(txId).do();
        if (pendingInfo !== undefined) {
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                return pendingInfo;
            } else {
                if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                    throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
                }
            }
        }
        await client.statusAfterBlock(currentround).do();
        currentround++;
    }
    throw new Error("Transaction " + txId + " not confirmed after " + timeout + " rounds!");
}
