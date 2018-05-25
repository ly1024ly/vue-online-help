<template>
  <div class="template">
    <item></item>
  </div>
</template>

<style scoped>
  @import "../style/template.scss"
</style>

<script type="text/javascript">
  import item from "./item.vue";
  export default {
    data(){
      return {

      }
    },
    components:{
      item
    },
    mounted(){
      console.log(item)
      this.$emit("success","success");
    }
  }
</script>