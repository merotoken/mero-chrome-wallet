<template>
	<div>
		<nav class="p-2" style="background-color: #07192d; border-bottom: 1px solid #ccc;">
			<img id="logo" src="./../../assets/img/logo.png" style="margin-top: 4px; padding: 5px 0;">
		</nav>
		<div class="md:container p-4">
	      	<div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mb-3">
		        <span>
		        	{{ tokenName }} Wallet Terms & Conditions
		        </span>
	      	</div>
	      	<div class="mt-4 w-full bg-gray-100 rounded p-4 text-xs">
	      		<p class="font-bold mb-4">I understand I am responsible for the following items.</p>
	      		<p><i class="far fa-check-circle text-xs text-green-400 mr-2"></i>I am responsible for the safe storage of my recovery</p>
	      		<p class="ml-5 mb-2">seed phrase.</p>
	      		<p><i class="far fa-check-circle text-xs text-green-400 mr-2"></i>I am responsible for my private key and will not share</p>
	      		<p class="ml-5 mb-2">with anyone.</p>
	      		<p><i class="far fa-check-circle text-xs text-green-400 mr-2"></i>I am responsible for protecting my computer from</p>
	      		<p class="ml-5 mb-2">malware that could compromise my wallet.</p>
	      		<p class="mt-2">I also understand this wallet is being used <span class="font-bold">as-is</span>, with no warranty or guarantee of support.</p>
	      		<p class="mt-2">{{ tokenName }} is not responsible for any loss of Binance Coin (BNB) or {{ tokenName }} ({{ tokenTicker }}) by using this wallet.</p>
	      	</div>
	      	<div class="flex justify-center mt-3">
		        <button 
		          class="focus:outline-none bg-blue-400 hover:bg-blue-800 text-white py-3 px-6 rounded" 
		          type="button"
		          @click="saveAgreement()"
		        >I Accept this Agreement</button>
	      	</div>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';

	export default {
		data () {
			return {
				tokenTicker: env.tokenTicker,
				tokenName: env.tokenName,
			}
		},

		methods: {
			saveAgreement: function () {
				localStorage.setItem('agreement', 'accepted');
				this.$router.push('Create');
			}
		}
	}
</script>
