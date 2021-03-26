<template>
	<div class="h-screen bg-gray-100">
		<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded border border-gray-200 px-4 pt-2 pb-6 mb-4">
					<div class="text-gray-800 font-bold text-sm border-b border-gray-200 pb-2 mb-4">Settings</div>
					    <button 
					    	class="w-full focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 px-6 rounded text-xs outline-none mb-3" 
					    	@click="navigate('ExportPrivateKey')"
					    >
					      Export Private Key
					    </button>
					    <button 
					    	class="w-full focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 px-6 rounded text-xs outline-none mb-3" 
					    	@click="navigate('ExportSeedPhrase')"
					    >
					      Export Seed Phrase
					    </button>
					    <button 
					    	class="w-full focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 px-6 rounded text-xs outline-none mb-3" 
					    	@click="navigate('Create')"
					    >
					      Create New Wallet
					    </button>
					    <button 
					    	class="w-full focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 px-6 rounded text-xs outline-none mb-3" 
					    	@click="navigate('Create', true)"
					    >
					      Restore Wallet
					    </button>
					    <button 
					    	class="w-full focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 px-6 rounded text-xs outline-none mb-3" 
					    	@click="reset()"
					    >
					      Reset Wallet
					    </button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';
	import WalletHeader from './components/WalletHeader';

	export default {
		components: { WalletHeader },

		data () {
			return {}
		},

		methods: {
			navigate: function (destination, restore = false, goBack = true) {
				this.$router.push({ name: destination, params: { restore: restore, goBack: goBack } });
			},

			reset: function () {
				localStorage.removeItem('bnbPrice');
				localStorage.removeItem('bnbBalance');
				localStorage.removeItem('bnbPendingTxs');
				
				localStorage.removeItem('tokenPrice');
				localStorage.removeItem('tokenBalance');
				localStorage.removeItem('tokenPendingTxs');

				this.$router.push('Wallet');
			}
		}
	}
</script>
