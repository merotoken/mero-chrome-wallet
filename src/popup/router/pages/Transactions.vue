<template>
	<div class="h-screen bg-gray-100">
		<WalletHeader></WalletHeader>

		<div class="flex justify-center p-4">
			<div class="w-full max-w-md">
				<div class="bg-white rounded border border-gray-220 px-4 pt-2 pb-2 mb-2">
					<div class="text-gray-800 font-bold text-sm border-b border-gray-200 pb-2">Transactions Sent</div>
						<p v-if="transactions.length == 0" class="text-xs pt-4" style="height: 60px;">
							There are no transactions to show.
						</p>

						<div class="overflow-y-scroll" style="height: 320px;" v-if="transactions.length > 0">
							<div class="py-2 border-b border-gray-200" v-for="transaction in transactions">
								<a 
									:href="formatUrl(transaction.hash)"
									target="_new"
								>
									<div class="flex justify-between pr-2">
										<div 
											class="inline-block px-3 py-1 text-center text-white rounded-full shadow ripple focus:outline-none"
											:class="transaction.currency == 'BNB' ? 'bg-gray-600' : 'bg-blue-600'"
										>
											<span style="font-size: 11px;" class="font-bold">
												{{ formatAmount(transaction.amount) }} 
												{{ transaction.currency }} 
												<i style="font-size: 8px;">{{ transaction.pending ? ' Pending' : '' }}</i>
											</span>
										</div>
										<div class="mt-1 mr-1">
											{{ formatDate(transaction.timestamp) }}
										</div>
									</div>
									<div class="mt-1" style="font-size: 11px;">
										To: {{ transaction.address }}
									</div>
								</a>
							</div>
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
	import moment from 'moment';
	import WalletHeader from './components/WalletHeader';
	import Web3 from 'web3';

	const web3 = new Web3(env.BinanceSmartChain);

	export default {
		components: { WalletHeader },

		data () {
			return {
				transactions: [],
				bnbTransactions: [],
				tokenTransactions: [],
				refreshing: false
			}
		},

		mounted() {
			this.getTransactions();
		},

		methods: {		
			getTransactions: async function () {
				let transactions = await localStorage.getItem('transactions');

				transactions = transactions != null ? JSON.parse(transactions) : [];

				transactions.sort((a, b) => {
					return parseInt(b.timestamp) - parseInt(a.timestamp);
				});

				this.transactions = transactions;

				this.checkPendingTxs();
			},

			checkPendingTxs: async function () {
				this.transactions.map(async (tx) => {
					if(tx.pending == true) {
						const txReceipt = await web3.eth.getTransactionReceipt(tx.hash);
						if(txReceipt) {
							this.$set(tx, 'pending', false);

							localStorage.setItem('transactions', JSON.stringify(this.transactions));

							this.getTransactions();
						}
					}
				});
			},

			formatDate: function (timestamp) {
				return utils.formatTime(timestamp);
			},

			formatUrl: function (txHash) {
				return 'https://bscscan.com/tx/' + txHash;
			},

			formatAmount: function (amount) {
				return parseFloat(amount);
			}
		}
	}
</script>
