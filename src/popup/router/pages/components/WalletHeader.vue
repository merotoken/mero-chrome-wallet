<template>
	<nav class="p-2 flex justify-between" style="background-color: #07192d; border-bottom: 1px solid #ccc;">
		<div>
			<a href="#">
				<img id="logo" src="./../../../assets/img/logo.png" style="padding: 10px 0 0 4px;">
			</a>
		</div>
		<div class="justify-between">
			<a 
				href="#" 
				class="inline-block text-sm px-4 py-2 mt-1 mr-2 leading-none border rounded text-blue-300 border-blue-300 hover:border-transparent hover:text-blue-900 hover:bg-white no-underline" 
				@click="navigate('Wallet')"
			>
				<i class="fa fa-wallet"></i>
			</a>
			<a 
				href="#" 
				class="inline-block text-sm px-4 py-2 mt-1 mr-2 leading-none border rounded text-blue-300 border-blue-300 hover:border-transparent hover:text-blue-900 hover:bg-white no-underline" 
				@click="navigate('Settings')"
			>
				<i class="fa fa-cog"></i>
			</a>
			<a 
				href="#" 
				class="inline-block text-sm px-4 py-2 mt-1 mr-2 leading-none border rounded text-blue-300 border-blue-300 hover:border-transparent hover:text-blue-900 hover:bg-white no-underline" 
				@click="navigate('Unlock')"
			>
				<i class="fa fa-lock"></i>
			</a>
		</div>
	</nav>
</template>

<script>
	export default {
		data () {
			return {}
		},

		methods: {
			navigate: function (destination) {
				this.$router.push({ name: destination, params: { walletAddress: this.walletAddress } }).catch(()=>{});
			}
		}
	}
</script>
