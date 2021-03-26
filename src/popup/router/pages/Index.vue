<template>
	<div class="h-screen bg-gray-100">
		<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded-md border border-gray-200 px-4 pt-2 pb-3 mb-3">
					<div class="flex justify-between">
						<div>
							<div class="text-sm font-semibold pb-1">Total Portfolio</div>
							<div class="text-3xl font-bold pb-4">
								${{ parseFloat(bnbValue + tokenValue).toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
							</div>
						</div>
						<div>
							<button 
								type="button" 
								class="focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-2 px-4 rounded mt-4 mr-3" 
								@click="updateWallet()"
							>
								<i class="fa fa-sync-alt text-md" :class="refreshing ? 'fa-spin' : ''"></i>
							</button>
						</div>
					</div>
					<div class="flex justify-around border-t border-gray-200 pt-4">
						<div>
							<a 
								href="#" 
								class="inline-block w-16 h-10 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-md shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
								@click="navigate('Send')"
							>
								<i class="pt-3 fa fa-paper-plane"></i>
							</a>
							<p class="text-center text-gray-500 mt-1 font-semibold" style="font-size: 9px;">Send</p>
						</div>
						<div>
							<a 
								href="#" 
								class="inline-block w-16 h-10 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-md shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
								@click="navigate('Receive')"
							>
								<i class="pt-3 fa fa-qrcode"></i>
							</a>
							<p class="text-center text-gray-500 mt-1 font-semibold" style="font-size: 9px;">Receive</p>
						</div>
						<div>
							<a 
								href="#" 
								class="inline-block w-16 h-10 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded-md shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
								@click="navigate('Transactions')"
							>
								<i class="pt-3 fa fa-exchange-alt"></i>
							</a>
							<p class="text-center text-gray-500 mt-1 font-semibold" style="font-size: 9px;">Transactions</p>
						</div>
						<div>
							<a 
								:href="bscScanUrl"
								target="_new"
								class="inline-block w-16 h-10 text-sm font-medium leading-6 flex justify-center text-white uppercase transition bg-blue-500 rounded-md shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
							>
								<span class="p-2"><img id="etherscan-logo" src="./../../assets/img/bscscan-logo-light-circle.png" style="height: 22px;"></span>
							</a>
							<p class="text-center text-gray-500 mt-1 font-semibold" style="font-size: 9px;">BscScan</p>
						</div>
					</div>
				</div>
				<div class="bg-white rounded-md border border-gray-200 px-4 py-4 mb-3">
					<div class="flex justify-between">
						<div class="flex justify-between">
							<div>
								<img id="logo" src="./../../assets/img/mero-logo.png" style="height: 48px;">
							</div>
						</div>
						<div>
							<div class="text-lg text-right font-semibold">{{ tokenBalance }} {{ tokenTicker }}</div>
							<div class="text-right text-gray-600">${{ tokenValue.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</div>
						</div>
					</div>
				</div>
				<div class="bg-white rounded-md border border-gray-200 px-4 py-4">
					<div class="flex justify-between">
						<div class="flex justify-between">
							<div>
								<img id="logo" src="./../../assets/img/bnb-logo.png" style="height: 48px;">
							</div>
						</div>
						<div>
							<div class="text-lg text-right font-semibold">{{ bnbBalance }} BNB</div>
							<div class="text-right text-gray-600">${{ bnbValue.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</div>
						</div>
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
	import _ from 'lodash';
	import WalletHeader from './components/WalletHeader';
	import Web3 from 'web3';

	const web3 = new Web3(env.BinanceSmartChain);

	export default {
		components: { WalletHeader },
		
		data () {
			return {
		        tokenTicker: env.tokenTicker,
		        tokenName: env.tokenName,
				walletAddress: '',
				tokenPrice: '0.00',
				tokenBalance: '0',
				tokenValue: '0.00',
				bnbPrice: '0.00',
				bnbBalance: '0',
				bnbValue: '0.00',
				portfolioValue: '0.00',
				bscScanUrl: '',
				refreshing: false
			}
		},

		mounted() {
			this.hasWalletAddress();
		},

		methods: {
			hasWalletAddress: async function () {
				const walletAddress = await localStorage.getItem('walletAddress');
				const privateKey = await localStorage.getItem('privateKey');

				if(!walletAddress) {
					this.$router.push('Create');
				} else if(!privateKey) {
					this.$router.push('Unlock');
				} else {
					this.walletAddress = walletAddress.toString();
					this.bscScanUrl = 'https://bscscan.com/address/' + walletAddress.toString();

					this.getStorageValues();
				}
			},

			getStorageValues: async function () {
				let tokenPrice = await localStorage.getItem('tokenPrice');
				let tokenBalance = await localStorage.getItem('tokenBalance');

				let bnbPrice = await localStorage.getItem('bnbPrice');
				let bnbBalance = await localStorage.getItem('bnbBalance');

				this.tokenPrice = tokenPrice != null ? parseFloat(tokenPrice) : parseFloat(0.00);
				this.tokenBalance = tokenBalance != null ? parseFloat(tokenBalance) : 0;
				this.tokenValue = parseFloat(tokenBalance * tokenPrice);

		        this.bnbPrice = bnbPrice != null ? parseFloat(bnbPrice) : parseFloat(0.00);
		        this.bnbBalance = bnbBalance != null ? parseFloat(utils.format(bnbBalance, 6)) : 0;
		        this.bnbValue = parseFloat(bnbBalance * bnbPrice);

				this.updateWallet();
			},

			updateWallet: function () {
				this.refreshing = true;

				this.getPrices();
				this.getBalances();
			},

			getPrices: function () {
				// BNB
			    axios.get("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd")
					.then((response) => {
						localStorage.setItem('bnbPrice', response.data.binancecoin.usd.toString());
						this.bnbPrice = response.data.binancecoin.usd
					})
					.catch((error) => { console.log(error); });

				// Token
			},

			getBalances: async function () {
				// Token
                web3.eth.call({
                    to: env.contractAddress,
                    data: '0x70a08231000000000000000000000000' + this.walletAddress.substring(2)
                }, (error, balance) => {
                    if(balance) {
						let tokenBalance = ethers.utils.formatUnits(balance.toString(), env.tokenDecimals);
						localStorage.setItem('tokenBalance', tokenBalance.toString());
						
						this.tokenBalance = utils.format(tokenBalance, 6);
						this.tokenValue = parseFloat(tokenBalance * this.tokenPrice);
                    } else {
                    	console.log(error);
                    }
                });

				// BNB
				web3.eth.getBalance(this.walletAddress)
					.then((balance) => {
						let bnbBalance = ethers.utils.formatEther(balance);

						localStorage.setItem('bnbBalance', bnbBalance.toString());
						this.bnbBalance = utils.format(bnbBalance, 6);
						this.bnbValue = parseFloat(bnbBalance * this.bnbPrice);

						this.refreshing = false;
					})
					.catch((error) => { console.log(error) });
			},

			navigate: function (destination) {
				this.$router.push({ name: destination });
			}
		}
	}
</script>
