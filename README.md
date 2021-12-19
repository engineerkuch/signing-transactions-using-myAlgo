# Signing-transactions-using-MyAlgoConnect.
# THIS SCRIPT ASSUME'S THAT YOU HAVE A BASIC UNDERSTANDING OF NODEJS AND ALGORAND'S INFRASTRUCTURE.
This script demonstrates the use of MyAlgoConnect for transaction signing. The purpose of using My Algo Connect is because: i) you can sign transactions using a regular password without exposing your wallet's mnemonics/privateKey. And, although there are other options for achieving the same result (i.e. using AlgoSigner, which is a chrome extension and hence only works on chrome browser), using My Algo Connect makes it possible to sign transactions using your favorite browser. By the way, [My Algo](https://wallet.myalgo.com/) does more than just signing transactions, so please explore the tool.


## Prerequisites/Requirements:
 - You must set up an account with [My Algo](https://wallet.myalgo.com/).
 - You're connected to the network by either [running a node](https://developer.algorand.org/docs/run-a-node/setup/install/?from_query=running%20a%20node#debian-based-distributions-debian-ubuntu-linux-mint), or by using a third party API (for instance, [Pure Stake](https://developer.purestake.io/).
 - Two funded Algorand accounts.
 - An asset to transfer. 
   - Before an asset can be transfered, the receiving account must first opt-in. Please visit [Algorand's Developer Portal](https://developer.algorand.org/docs/get-details/asa/?from_query=ASA#create-publication-overlay) to learn more about ASAs.
 - NodeJS with three SDKs
   - algosdk: for connecting to Algorand's node.
   - @randlabs/myalgo-connect: for connecting to My Algo Connect
   - browserify: for generating out javascript code. NodeJS doesn't run on the browser, so browserify helps us generate browser compatible JS code. Please visit [Browserify](https://browserify.org/) to learn more. 


# Commands:
 - npm init -y
 - sudo npm install -g browserify
   - sudo browserify index.js -o browserified.js
     - instead of the index.js, the generated browserified.js file is what you'll embed in your index.html
 - npm install algosdk
 - npm install @randlabs/myalgo-connect


### To see the outputs, use the browser's console (in case you don't already know :-|) 
