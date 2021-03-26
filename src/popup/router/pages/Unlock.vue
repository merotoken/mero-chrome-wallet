<template>
	<div class="h-screen bg-gray-100">
		<nav class="p-2" style="background-color: #07192d; border-bottom: 1px solid #ccc;">
			<img id="logo" src="./../../assets/img/logo.png" style="margin-top: 4px; padding: 5px 0;">
		</nav>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded-md border border-gray-200 px-4 pt-4 pb-4 mb-2">
					<div class="bg-blue-100 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
						<p>Please enter your wallet password below to unlock your wallet. If you do not know your password you can restore your account with your 12-word seed phrase.</p>
					</div>
					<input 
						type="password" 
						class="appearance-none outline-none block w-full text-gray-600 border rounded py-3 px-4 mt-4 b-3 leading-tight focus:outline-none focus:border-gray-light"
						:class="error ? 'border-red-200 bg-red-100' : 'border-gray-100 bg-gray-100'"
						:placeholder="error ? 'Incorrect Password' : 'Password'"
						v-model="password"
						@keyup.enter="unlock()"
					>
				</div>
		      	<div class="flex justify-center mt-4">
			        <button 
			          class="focus:outline-none bg-blue-400 w-full hover:bg-blue-800 text-white py-3 px-6 rounded" 
			          type="button"
			          @click="unlock()"
			        >Unlock Wallet</button>
		      	</div>
				<div class="flex justify-center mt-2">
					<div>
						<img id="logo" src="./../../assets/img/mero-logo.png" style="width: 96px;">
					</div>
				</div>
				<div class="flex justify-center mt-1">
					<div>
						<u><a href="#" @click="navigate('Create', true, false)">Restore wallet using seed phrase.</a></u>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';
	import { AES, enc } from 'crypto-js';
	import Web3 from 'web3';

	const web3 = new Web3();

	export default {
		data () {
			return {
				password: '',
				error: false
			}
		},

		mounted() {
			this.clearKeys();
		},

		methods: {
			clearKeys: function () {
		        localStorage.removeItem('privateKey');
			},

			unlock: async function () {
				const passwordEncrypted = await localStorage.getItem('passwordEncrypted');
				const privateKeyEncrypted = await localStorage.getItem('privateKeyEncrypted');

				if(web3.utils.sha3(this.password) === passwordEncrypted) {
					let privateKey  = AES.decrypt(privateKeyEncrypted, this.password).toString(enc.Utf8);
					localStorage.setItem('privateKey', privateKey);

					this.$router.push('PageIndex');
				} else {
					this.password = '';
					this.error = true;
				}
			},

			navigate: function (destination, restore = false, goBack = true) {
				this.$router.push({ name: destination, params: { restore: restore, goBack: goBack } });
			},
		}
	}
</script>
