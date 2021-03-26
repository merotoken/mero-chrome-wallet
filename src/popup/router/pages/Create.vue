<template>
	<div>
		<nav class="p-2" style="background-color: #07192d; border-bottom: 1px solid #ccc;">
			<img id="logo" src="./../../assets/img/logo.png" style="margin-top: 3px; padding: 5px 0;">
		</nav>
		<div class="md:container p-4">
	      	<div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-3 ">
		        <span v-if="restore">
		        	Please type your recovery seed phrase below. You must type it exactly as it was originally presented to you. It will be a total of 12 individual words.
		        </span>
		        <span v-else>
					Please write this seed phrase down on paper and keep in a safe place. If you lose this phrase you will not be able to restore your account or your current balances.
		        </span>
	      	</div>
	      	<form role="form">
	      		<div class="flex justify-between">
	      			<label class="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2">Seed Phrase</label>
	      			<div class="flex">
			            <a 
			                href="#" 
			                class="block uppercase tracking-wide text-blue-400 text-xs font-bold mb-2 no-underline hover:text-blue-800"
			                id="seed" 
			                :data-clipboard-text="seedPhrase"
			                @click="setCopied()"
			                v-if="!restore"
			            >Copy Seed to clipboard</a>
			            <i class="ml-2 pt-1 text-xs text-blue-400 fas fa-check-double" v-if="copied"></i>
		            </div>
		        </div>
				<textarea 
					class="appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight lowercase text-xl focus:outline-none focus:border-gray-200" 
					rows="3" 
					v-model="seedPhrase"
				></textarea>
				<input 
					type="password" 
					class="appearance-none outline-none block w-full text-gray-600 border rounded py-3 px-4 mt-3 b-3 leading-tight focus:outline-none focus:border-gray-light"
					:class="error ? 'bg-red-100 border-red-200' : 'bg-gray-100 border-gray-100'"
					:placeholder="error ? 'Passwords do not match' : 'New Wallet Password'"
					v-model="password"
				>
				<input 
					type="password" 
					class="appearance-none outline-none block w-full bg-gray-100 text-gray-600 border border-gray-100 rounded py-3 px-4 mt-3 b-3 leading-tight focus:outline-none focus:border-gray-light"
					placeholder="Confirm New Wallet Password"
					v-model="confirmPassword"
				>
				<div class="flex justify-between mt-3">
					<button type="button" :disabled="password == ''" class="focus:outline-none bg-blue-500 hover:bg-blue-800 text-white py-3 px-6 rounded" @click="generateWallet()">
						<span v-if="restore">Restore Wallet</span>
						<span v-else>Create Wallet</span>
					</button>
					<a 
						href="#" 
						class="bg-red-lightest border border-red-light text-red-dark py-3 px-6 rounded no-underline" 
						v-if="goBack === true"
						@click="$router.push('Settings');"
					>Cancel</a>
				</div>
				<div class="text-red-600 mt-1" v-if="invalid">
					Seed Phrase is invalid.
				</div>
	      	</form>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';
	import { ethers } from 'ethers';
	import { AES, enc } from 'crypto-js';
	import Web3 from 'web3';

	const web3 = new Web3();

	export default {
		props: ['goBack', 'restore'],

		data() {
			return {
				seedPhrase: '',
				privateKey: '',
				password: '',
				confirmPassword: '',
				walletAddress: '',
				copied: false,
				invalid: false,
				error: false
			}
		},

		mounted() {
			this.hasAcceptedAgreement();
		},

	  	methods: {
			hasAcceptedAgreement: async function () {
				const agreement = await localStorage.getItem('agreement');

				if(agreement !== 'accepted') {
				  this.$router.push('Agreement');
				} else {
					if(this.restore != true) {
						this.generateSeedPhrase();
					}
				}
			},

			generateSeedPhrase: function () {
				const wallet = ethers.Wallet.createRandom();

				if(this.restore != true) {
					this.seedPhrase = wallet.mnemonic.phrase;
				}
			},

			setCopied: function () {
				this.copied = true;
			},

			clearStorage: function () {
		        localStorage.removeItem('seedPhraseEncrypted');
		        localStorage.removeItem('privateKey');
		        localStorage.removeItem('privateKeyEncrypted');
		        localStorage.removeItem('walletAddress');
		        localStorage.removeItem('bnbBalance');
		        localStorage.removeItem('tokenBalance');
		        localStorage.removeItem('transactions');
			},

			generateWallet: async function () {
				this.invalid = false;

				if(this.password == this.confirmPassword) {
					let seedPhrase = this.seedPhrase.toLowerCase();
					
					if(ethers.utils.isValidMnemonic(seedPhrase)) {
						const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

						this.privateKey = wallet.privateKey;
						this.walletAddress = wallet.address;

						this.clearStorage();

						localStorage.setItem('passwordEncrypted', web3.utils.sha3(this.password));
						localStorage.setItem('seedPhraseEncrypted', AES.encrypt(seedPhrase, this.password).toString());

						localStorage.setItem('privateKey', this.privateKey);
						localStorage.setItem('privateKeyEncrypted', AES.encrypt(this.privateKey, this.password).toString());

						localStorage.setItem('walletAddress', this.walletAddress.toString());

						this.$router.push('PageIndex');
					} else {
						this.invalid = true;
					}
				} else {
					this.password = '';
					this.confirmPassword = '';
					this.error = true;
				}
			}
	    }
	}
</script>
