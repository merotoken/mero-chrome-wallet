<template>
	<div class="h-screen bg-gray-100">
		<!-- Message Modal -->
		<Modal @close="hideModal()" :message="message" :navigateHome="navigateHome" v-show="openModal" />

		<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded-md border border-gray-200 px-4 pt-4 pb-6">
					<div class="flex justify-between">
						<span class="mb-2 text-base font-semibold">SEND {{ currency }}</span>
						<div class="inline-flex">
							<button 
								class="focus:outline-none border border-bg-gray-100 hover:bg-gray text-gray-600 font-bold py-2 px-4 rounded-l" 
								:class="currency == tokenTicker ? 'bg-gray-200' : 'bg-gray-100'"
								@click="setCurrency(tokenTicker)"
							>
								{{ tokenTicker }}
							</button>
							<button 
								class="focus:outline-none border border-bg-gray-100 hover:bg-gray text-gray-600 font-bold py-2 px-4 rounded-r" 
								:class="currency == tokenTicker ? 'bg-gray-100' : 'bg-gray-200'"
								@click="setCurrency('BNB')"
							>
								BNB
							</button>
						</div>
					</div>
					<div>
						<label class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">Pay To</label>
						<input 
							type="text" 
							class="appearance-none outline-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-light"
							placeholder="Recipient Address"
							v-model="sendRecipient"
						>
					</div>
					<div>
						<div class="flex justify-between">
							<label class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">Amount</label>
							<a href="#" class="block uppercase tracking-wide text-blue-400 text-xs font-bold mb-2 no-underline" @click="sendMax()">Send Max</a>
						</div>
						<input 
							type="text" 
							class="appearance-none outline-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-light"
							:placeholder="currency"
							v-model="sendAmount"
						>
					</div>
					<div>
						<div class="flex justify-between">
							<label class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">Sending Gas Fee</label>
			                <p class="text-xs uppercase text-right text-red-600 text-xs font-bold" v-if="sendBnbBalance == 0">
			                	Insufficient BNB to send
			                </p>
						</div>
						<div class="flex">
							<div class="w-1/2">
								<input 
								type="text" 
								class="appearance-none outline-none block bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-light"
								v-model="sendGas"
								>
							</div>
							<div class="w-1/2">
								<div class="inline-flex" style="margin-top: 2px;">
									<button class="focus:outline-none bg-gray-100 border bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 mr-1 rounded-l-lg" @click="subtractGwei()">
										<i class="fas fa-chevron-circle-down"></i>
									</button>
									<button class="focus:outline-none bg-gray-100 border bg-gray-100 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r-lg" @click="addGwei()">
										<i class="fas fa-chevron-circle-up"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div>
						<button 
							type="button" 
							class="focus:outline-none bg-blue-400 hover:bg-blue-800 font-semibold text-white py-3 px-6 rounded"
							:class="sendButtonDisabled ? 'bg-gray-500 opacity-70 cursor-not-allowed' : ''"
							style="margin-top: 5px;"
							:disabled="sendButtonDisabled"
							@click="verifyTransaction()"
						>Send Transaction <i class="ml-1 fas fa-spin fa-circle-notch" v-if="loading"></i>
						</button>
					</div>
					<div class="text-right text-xs text-gray-300 mt-1">
						<span v-if="currency == 'BNB'">
							{{ sendBnbBalance }} BNB Available
						</span>
						<span v-else>
							{{ sendTokenBalance }} {{ tokenTicker }} Available
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';
	import utils from './../../common/Utilities';
	import axios from 'axios';
	import { ethers } from 'ethers';
	import moment from 'moment';
	import WalletHeader from './components/WalletHeader';
	import Modal from './components/Modal';
	import Web3 from 'web3';

	const web3 = new Web3(env.BinanceSmartChain);

	export default {
		components: { WalletHeader, Modal },

		data () {
			return {
		        tokenTicker: env.tokenTicker,
		        tokenName: env.tokenName,
		        currency: env.tokenTicker,
		        bnbPrice: 0,
		        bnbGas: 0,
		        sendBnbBalance: 0,
		        sendTokenBalance: 0,
		        sendRecipient: '',
		        sendAmount: '',
		        sendGasAmount: 80000,
		        sendGasFee: 0,
		        sendGasCost: '0.00',
		        sendButtonDisabled: false,
		        sendGas: 5,
		        loading: false,
		        openModal: false,
		        message: '',
		        navigateHome: false,
		        datestamp: '',
		        error: []
			}
		},

		mounted() {
			this.getGasPrice();
			this.bootstrapStorage();
		},

		methods: {
			getGasPrice: async function () {
				web3.eth.getGasPrice()
					.then((gasPrice) => {
						const gasGwei = ethers.utils.formatUnits(gasPrice.toString(), 'gwei');
						this.sendGas = Math.round(gasGwei);
						this.bnbGas = Math.round(gasGwei);

					}).catch((error) => { console.log(error) });
			},

			bootstrapStorage: async function () {
		        let bnbPrice = await localStorage.getItem('bnbPrice');
		        let bnbBalance = await localStorage.getItem('bnbBalance');
		        let tokenBalance = await localStorage.getItem('tokenBalance');

		        this.bnbPrice = bnbPrice;
		        this.sendBnbBalance = utils.format(bnbBalance, 6);
		        this.sendTokenBalance = utils.format(tokenBalance, 6);
			},

			addGwei: function () {
				this.sendGas = this.sendGas + 1;
			},

			subtractGwei: function () {
				if(this.sendGas > this.bnbGas) {
				  this.sendGas = this.sendGas - 1;
				}
			},

			setCurrency: function (currency) {
				this.currency = currency;
				this.sendAmount = '';
			},

			sendMax: function () {
				if(this.currency == 'BNB') {
					this.sendAmount = this.sendBnbBalance;
				} else {
					this.sendAmount = this.sendTokenBalance;
				}
			},

			showModal: function(message, navigateHome = false) {
				this.openModal = true;
				this.navigateHome = navigateHome;
				this.message = message;
			},

			hideModal: function () {
				this.openModal = false;
				this.navigateHome = false;
				this.message = '';
			},

			disableButton: function () {
				this.sendButtonDisabled = true;
				this.loading = true;
			},

			enableButton: function () {
				this.sendButtonDisabled = false;
				this.loading = false;
			},

			verifyTransaction: async function () {
				let privateKey = await localStorage.getItem('privateKey');

				if(privateKey) {
					privateKey = privateKey.toString();

			        let sendBnbBalance = parseFloat(this.sendBnbBalance);
			        let sendGas = parseFloat(this.sendGas);
			        let sendGasAmount = parseInt(this.sendGasAmount);
			        let sendAmount = parseFloat(this.sendAmount);
			        let sendRecipient = this.sendRecipient.trim();

					if(sendRecipient != '' && sendAmount != '' && sendGasAmount != '') {
						if(!ethers.utils.isAddress(sendRecipient)) {
							this.showModal('Recipient address is not valid.');
							return;
						} else if(sendBnbBalance <= 0) {
							this.showModal('Please deposit BNB to send this currency.');
							return;
						} else if(sendGas <= 0) {
							this.showModal('Gas price is too low.');
							return;
						} else if(isNaN(sendAmount)) {
							this.showModal('Amount must be a number.');
							return;
						} else if(isNaN(sendGas)) {
							this.showModal('Gas must be a number.');
							return;
						} else if(sendAmount <= 0) {
							this.showModal('You must choose an amount to send.');
							return;
						}

						this.disableButton();

				        // Format the gas price.
				        sendGas = ethers.utils.parseUnits(sendGas.toString(), 'gwei');

				        if(this.currency == 'BNB') {
				        	// Send BNB
				        	if(sendAmount <= parseFloat(this.sendBnbBalance)) {
					        	sendAmount = ethers.utils.parseEther(sendAmount.toString());
					     		// Format the TX
								let transaction = {
									to: sendRecipient,
									value: sendAmount,
									gasLimit: sendGasAmount,
									gasPrice: sendGas
								};
								// Send the transaction
								this.sendTransaction(privateKey, sendRecipient, sendAmount, transaction);
				        	} else {
								this.showModal('You have insufficient funds.');
								this.enableButton();
								return;
				        	}
				        } else {
				        	// Send Token
				        	if(sendAmount <= parseFloat(this.sendTokenBalance)) {
					        	sendAmount = ethers.utils.parseUnits(sendAmount.toString(), env.tokenDecimals);
					        	// Connect to the contract
					        	let contractAddress = env.contractAddress;
					        	let contract = new web3.eth.Contract(env.abi, contractAddress);
					        	// Set contract variables.
					        	let data = contract.methods.transfer(sendRecipient, sendAmount).encodeABI();
					     		// Format the TX
								let transaction = {
									to: contractAddress,
									value: 0,
									gasLimit: sendGasAmount,
									gasPrice: sendGas,
									data: data
								};
					        	// Send the transaction
					        	this.sendTransaction(privateKey, sendRecipient, sendAmount, transaction);
				        	} else {
								this.showModal('You have insufficient funds.');
								this.enableButton();
								return;
				        	}
				        }
					} else {
						this.showModal('All fields are required.');
						return;
					}
				} else {
					this.showModal('Key failure, please restart the app.');
					return;
				}
			},

			sendTransaction: function (privateKey, sendRecipient, sendAmount, transaction) {
				web3.eth.accounts.signTransaction(transaction, privateKey)
					.then((signedTx) => {
						if(signedTx) {
							web3.eth.sendSignedTransaction(signedTx.rawTransaction.toString())
								.then((transaction) => {
									if(transaction) {
										this.storeTransaction(this.currency, transaction.transactionHash, sendRecipient, sendAmount);

										this.showModal('Successful Transaction: ' + transaction.transactionHash, true);
									}
								}).catch((error) => { console.log(error); this.enableButton(); });
						}
					}).catch((error) => { console.log(error); this.enableButton(); });
			},

			storeTransaction: async function (currency, hash, recipientAddress, recipientAmount) {
				let timestamp = moment().unix();
				let amount = currency == 'BNB' 
								? ethers.utils.formatEther(recipientAmount).toString()
								: ethers.utils.formatUnits(recipientAmount, env.tokenDecimals).toString()

				let transaction = {
					pending: true,
					currency: currency,
					hash: hash,
					address: recipientAddress,
					amount: amount,
					timestamp: timestamp
				}

				let txs = await localStorage.getItem('transactions');

				txs = txs == null ? [] : JSON.parse(txs);
				txs.push(transaction);

				localStorage.setItem("transactions", JSON.stringify(txs));
			}
		}
	}
</script>
