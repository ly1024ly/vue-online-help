<template>

  <div :id="id" class="main" :style="parentStyle"></div>
</template>

<style lang="scss" scoped>
@import '../style/echart.scss'
</style>

<script type="text/javascript">
  import echarts from 'echarts'
  export default {
    props:['option',"id","parentStyle"],
    data() {
      return {
        chart:null,
        legend:[],
        data:this.option,
        num:[],
        rid:this.id
      }
    },
    methods:{
      drawLineGraph(id,data){
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption({
            title: {
                text: this.$t('message.WHstatus_FeedV')
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: data.map(function (item) {
                    return item[0];
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            toolbox: {
                left: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                startValue: '2014-06-01'
            }, {
                type: 'inside'
            }],
            series: {
                name: this.$t('message.WHstatus_FeedV'),
                type: 'line',
                data: data.map(function (item) {
                    return item[1];
                }),
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 4
                    }, {
                        yAxis: 8
                    }, {
                        yAxis: 12
                    }, {
                        yAxis: 16
                    }, {
                        yAxis: 20
                    }]
                }
            }
        })
      },
      drawPieGraph(id,data) { 
        var that = this;
        this.chart = echarts.init(document.getElementById(id));
        let legend = [];
        for(var i=0;i<data.data.length;i++){
          legend.push(data.data[i].name)
        }
        this.chart.setOption({
            title : {
                text: data.title,
                x:'left',
            },
            
            legend: {
                orient: 'vertical',
                left: 'right',
                data: legend,
                formatter:function(name){
                    let sum = 0;
                    let j=0;
                    while(j<data.data.length){
                        sum = sum + data.data[j].value;
                        j++
                    }
                    for(var i=0;i<data.data.length;i++){
                        if(name == data.data[i].name){
                          return data.data[i].name + " "+ (data.data[i].value/sum*100).toFixed(2) + "%";
                        }
                      }
                }
            },
            color:["red","#FFD900","green","gray","#ddf"],
            series : [
                {
                    name: data.name,
                    type: data.type,
                    radius : '55%',
                    center: ['40%', '60%'],
                    data:data.data,
                    labelLine:{
                        normal:{
                          show:false
                        }
                    },
                    label:{
                      normal:{
                        show:false
                      }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
         })  
      } 
    },
    mounted(){
      this.num.push(this.option)
      this.data = this.option;
      if(this.data&&this.data.data){
        for(var i=0;i<this.data.data.length;i++){
          this.legend.push(this.data.data[i].name)
        }
      }
      if(this.option.type == "pie"){
        this.drawPieGraph(this.id,this.option);
      }else if(this.option.type == "line"){
            this.drawLineGraph(this.id,this.option.data);
      }
    },
    watch:{
      option:function(value){
        this.data = value;
        if(value.type=="pie"){
            console.log("-gggggggggggggggggggggggggg");
            console.log(value)
            this.drawPieGraph(this.id,value);
        }
        if(value.type=="line"){
            this.drawLineGraph(this.id,value.data);
        }
      },
      num:function(val){
        
      },
      item:function(val){
      }

    }
  }
</script>