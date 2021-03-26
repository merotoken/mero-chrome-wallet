<template>
	<div class="h-screen absolute w-full flex flex-col items-center justify-center bg-black bg-opacity-80 font-sans">
		<div class="h-screen w-full absolute flex items-center justify-center bg-modal">
	        <div class="bg-white rounded-md shadow p-4 m-4 max-w-xs max-h-full text-center" v-if="message == 'loading'">
	            <div class="mx-4 my-3 text-lg text-gray-600">
	                <i class="fa fa-sync-alt fa-spin"></i>
	            </div>
	        </div>
	        <div class="bg-white rounded-md shadow p-4 m-4 w-3/4 max-h-full text-center" v-else>
	            <div class="mb-8">
	                <span class="text-sm break-all">{{ message }}</span>
	            </div>
	            <div class="flex justify-center" >
	                <button 
	                	class="flex-no-shrink text-white py-2 px-4 rounded bg-gray-400 hover:bg-gray-500"
	                	@click="close()"
	                >Close</button>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<script>
	export default {
		props: ['message', 'navigateHome'],

		data () {
			return {}
		},

		methods: {
			close: function () {
				if(this.navigateHome) {
					this.$router.push('Wallet');
				} else {
					this.$emit('close', true);
				}
			}
		}
	}
</script>