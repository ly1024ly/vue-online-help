<template>
  <div></div>
</template>

<style scoped>
  @import "../style/item.scss"
</style>

<script type="text/javascript">
  export default {
    data() {
      return{

      }
    },
    mounted(){
      console.log(this.el)
    },
    methods:{
      panstart(){
        console.log("start")
      },
      
    }
  }
</script>