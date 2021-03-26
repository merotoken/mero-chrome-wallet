<template>
	<div class="h-screen bg-gray-100">
		<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded border border-gray-200 px-4 pt-2 pb-6 mb-4">
					<div class="text-gray-800 font-bold text-sm border-b border-gray-200 pb-1 mb-2">Export Private Key</div>
						<div class="bg-blue-100 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
							<p>Please enter your wallet password below to show your private key.</p>
						</div>
						<div class="w-full bg-gray-200 text-lg rounded mt-3 p-4 h-28 break-words">
							{{ privateKey }}
						</div>
						<input 
							type="password" 
							class="appearance-none outline-none block w-full text-gray-600 border rounded py-3 px-4 mt-3 b-3 leading-tight focus:outline-none focus:border-gray-light"
							:class="error ? 'border-red-200 bg-red-100' : 'border-gray-100 bg-gray-100'"
							:placeholder="error ? 'Incorrect Password' : 'Password'"
							v-model="password"
							@keyup.enter="fetchPrivateKey()"
						>
				        <button 
				          class="focus:outline-none bg-blue-400 w-full hover:bg-blue-800 text-white mt-3 py-3 px-6 rounded" 
				          type="button"
				          @click="fetchPrivateKey()"
				        >Show Private Key</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import env from './../../../common/Environment';
	import WalletHeader from './../components/WalletHeader';
	import { AES, enc } from 'crypto-js';
	import Web3 from 'web3';

	const web3 = new Web3();

	export default {
		components: { WalletHeader },

		data() {
			return {
				privateKey: '',
				password: '',
				error: false
			}
		},

		mounted() {},

		methods: {
			fetchPrivateKey: async function () {
				const passwordEncrypted = await localStorage.getItem('passwordEncrypted');

				if(web3.utils.sha3(this.password) === passwordEncrypted) {
					const privateKeyEncrypted = await localStorage.getItem('privateKeyEncrypted');

					this.privateKey = AES.decrypt(privateKeyEncrypted, this.password).toString(enc.Utf8);
					this.password = '';
				} else {
					this.password = '';
					this.error = true;
				}
			}
		}
	}
</script>
