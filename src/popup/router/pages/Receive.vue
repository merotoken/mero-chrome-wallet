<template>
	<div class="h-screen bg-gray-100">
	  	<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded-md border border-gray-200 px-4 pt-4 pb-4 mb-2">
					<div class="bg-blue-100 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
						<p>Only send Binance Coin (BNB) or {{ tokenName }} ({{ tokenTicker }}) to this wallet address.</p>
					</div>

					<div class="flex justify-center my-4">
						<img class="border border-gray-200 shadow rounded-md" :src="qrcode" alt="QR Code">
					</div>

					<div 
						class="inline-flex justify-center w-full cursor-pointer"
						id="btn"
						:data-clipboard-text="walletAddress" 
						@click="copy()"
					>
						<span class="border border-gray-100 text-gray-800 text-xs font-bold py-4 px-2 rounded" id="address">
							{{ walletAddress }}
						</span>
					</div>
				</div>
				<div class="text-center mt-2" v-if="!copyButton">
					Click on the address to copy to the clipboard.
				</div>
				<div class="text-center text-red-400 mt-2" v-else>
					Address Copied!
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import env from './../../common/Environment';
	import QRCode from 'qrcode';
	import ClipboardJS from 'clipboard';
	import WalletHeader from './components/WalletHeader';

	new ClipboardJS('#btn');

	export default {
		components: { WalletHeader },

		data () {
			return {
				walletAddress: '',
		        tokenTicker: env.tokenTicker,
		        tokenName: env.tokenName,
		        qrcode: '',
		        copyButton: false
			}
		},

		mounted() {
			this.fetchWalletAddress();
		},

		methods: {
			fetchWalletAddress: async function () {
				this.walletAddress = await localStorage.getItem('walletAddress');

				this.createQrCode();
			},

			createQrCode: function () {
				QRCode.toDataURL(this.walletAddress)
					.then(url => {
						this.qrcode = url;
					})
					.catch(err => {
					console.error(err)
					})
			},

			copy: function () {
				this.copyButton = true;
			}
		}
	}
</script>
