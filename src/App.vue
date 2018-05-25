<template>
	<div id="ap" >
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>	
</template>

<script>
import Cookies from 'js-cookie'
export default {
	name: 'app',
	components: {
	},
	beforeCreate(){
		
	},
	created(){
		
	},
	beforeMount(){
	},
	mounted(){
		
	}
} 
</script>