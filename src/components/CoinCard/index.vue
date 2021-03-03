<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <img class="coin-card-image" :src="require(`./../../icons/coins/${coinKey.toLowerCase()}.png`)">
        <span class="coin-card-title">{{coinName}} ({{coinKey}})</span>
        <span :class="coinGrowth.class"><i :class="coinGrowth.icon"></i>{{coinGrowth.value}}%</span>
        <span style="float: right; color: gray; font-size: 13px">
          Última atualização: {{lastUpdate}}
          <el-button @click="handleRefresh" class="refresh-btn" :icon="refreshBtnIcon" type="warning" circle plain></el-button>
        </span>
      </div>
      <el-row>
        <el-col :span="12" class="price-container">
          <el-button icon="el-icon-circle-plus" v-loading="loading" class="price-btn" type="primary">
            Compra: R$ {{coinData.prices.buy}}
          </el-button>
        </el-col>
        <el-col :span="12" class="price-container">
          <el-button icon="el-icon-remove" v-loading="loading" class="price-btn" type="warning">
            Venda: R$ {{coinData.prices.sell}}
          </el-button>
        </el-col>
      </el-row>
      <el-row class="collapse-container">
        <el-collapse v-model="activeNames" v-loading="loading" @change="handleCollapse">
          <el-collapse-item name="1">
            <template slot="title">
              <b class="collapse-title"><i class="el-icon-s-unfold"></i> Dados recentes</b>
            </template>
            <fusioncharts
              type="timeseries"
              width="100%"
              height="400"
              dataFormat="json"
              :dataSource="dataSource"
            ></fusioncharts>
          </el-collapse-item>
        </el-collapse>
      </el-row>
    </el-card>
  </section>
</template>

<script>

import { COINS_DICT } from './../../utils/coins'

import { getCoinData } from '@/api/coins'

// Utils
import { formatDate } from '@/utils/date'

export default {
  name: 'Cryptocurrencies',
  props: ['coinKey'],
  components: {},
  data() {
    return {

      // Config
      coinName: '',
      coinLogo: '',

      // UX
      loading: false,
      refreshBtnIcon: 'el-icon-refresh-left',
      activeNames: ['1'],

      // Coin Data
      coinData: {},
      lastUpdate: null,
      lastCoinData: [],
      lastCoinSignals: [],
      dataSource: {
        data: null,
        chart: {
          palettecolors: "409eff,e6a23c,5a5a5a,a6a6a6",
        
        },
        caption: {
          text: "Preços"
        },
        subcaption: {
          text: ''
        },
        series: "Type",
        yaxis: [
          {
            plot: [
              {
                value: "Preço",
                connectnulldata: true
              }
            ],
            format: {
              prefix: "R$ ",
              round: "5",
            },
          },
        ]
      },

      // Growth
      coinGrowth: {}
    }
  },
  watch: {},
  methods: {
    handleCoinGrowth() {

      this.coinGrowth = {
        value: (this.coinData.growth.period['24h'].last * 100).toPrecision(3),
        class: '',
        icon: ''
      }

      if (this.coinGrowth.value >= 0) {
        this.coinGrowth.class = 'positive coin-card-growth'
        this.coinGrowth.icon  = 'el-icon-caret-top'
      } else {
        this.coinGrowth.class = 'negative coin-card-growth'
        this.coinGrowth.icon  = 'el-icon-caret-bottom'
      }
    },
    async handleRefresh() {
      this.loading = true
      this.refreshBtnIcon = 'el-icon-loading';
      this.coinData = await getCoinData(this.coinKey)
      this.lastUpdate = formatDate(new Date(this.coinData.date_ts*1000))
      let dt = await this.handleLastCoinData()
      this.lastCoinData    = dt[0]
      this.lastCoinSignals = dt[1]
      this.handleChartData()
      this.handleCoinGrowth()
      this.refreshBtnIcon = 'el-icon-refresh-left';
      this.loading = false
    },
    handleCollapse(activeList){
      if (activeList.legth > 0) this.handleRefresh()
    },
    handleChartData() {
      let schema = [
        {
            "name": "Data",
            "type": "date",
            "format": "%d/%m/%Y %H:%M"
        },
        {
          "name": "Type",
          "type": "string"
        },
        {
          "name": "Preço",
          "type": "number",
        }
      ]

      const fusionTable = new FusionCharts.DataStore().createDataTable(
        this.lastCoinData,
        schema
      );
      this.dataSource.data = fusionTable;
      this.dataSource.subcaption.text = this.coinName
      this.dataSource.dataMarker      = this.lastCoinSignals
      
    },
    async handleLastCoinData() {
      var that = this

      return new Promise(function(resolve, reject) {
        var lastCoinData    = []
        var lastCoinSignals = []

        that.coinData.last_history.forEach(function(data) {
          lastCoinData.push(
            [
              formatDate(new Date(data.date_ts*1000)),
              'Compra',
              data.prices.buy,
            ]
          )

          lastCoinData.push(
            [
              formatDate(new Date(data.date_ts*1000)),
              'Venda',
              data.prices.sell,
            ]
          )

          lastCoinData.push(
            [
              formatDate(new Date(data.date_ts*1000)),
              'Maior',
              data.prices.high,
            ]
          )

          lastCoinData.push(
            [
              formatDate(new Date(data.date_ts*1000)),
              'Menor',
              data.prices.low,
            ]
          )

          // Markups
          try{
            if(data.signals.rsi.last) {
              lastCoinSignals.push({
                series: {
                  Type: (data.signals.rsi.last == 'sell') ? "Compra" : "Venda"
                },
                time: formatDate(new Date(data.date_ts*1000)),
                identifier: data.signals.rsi.last[0].toUpperCase(),
                timeFormat: "%d/%m/%Y %H:%M",
                tooltext: `Sinal: \'${data.signals.rsi.last}\' (RSI)`
              })
            }
          } catch{}

          try{
            if(data.signals.macd.last) {
              lastCoinSignals.push({
                series: {
                  Type: (data.signals.macd.last == 'sell') ? "Compra" : "Venda"
                },
                time: formatDate(new Date(data.date_ts*1000)),
                identifier: data.signals.macd.last[0].toUpperCase(),
                timeFormat: "%d/%m/%Y %H:%M",
                tooltext: `Sinal: \'${data.signals.macd.last}\' (RSI)`
              })
            }
          } catch{}
        })

        resolve([lastCoinData, lastCoinSignals])
      })
      
    }
  },
  async beforeMount(){
    // Temp
    this.coinData = {
      coin_key: null,
      date_time: null,
      date_ts: null,
      metrics: {},
      signals: {},
      prices: {
        buy: null,
        sell: null,
      },
      vol: null
    }

    this.handleRefresh()
  },
  async mounted() {

    this.coinName = COINS_DICT[this.coinKey].name
    
  }
}
</script>

<style scoped>
  .coin-card-image {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .coin-card-title {
    font-size: 20px;
    vertical-align: middle;
  }

  .price-btn {
    width: 100%;
    cursor: default;
    font-size: 17px;
  }

  .price-container {
    padding: 3px
  }

  .refresh-btn {
    padding: 6px 6px
  }

  .collapse-container {
    margin-top: 20px;
    box-shadow: 0px 0px 3px coral;
  }

  .collapse-title {
    font-size: 19px;
    font-weight: 200;
    padding-left: 10px;
  }

  .coin-card-growth {
    font-size: 20px;
    vertical-align: middle;
    margin-left: 5px;
  }

  .positive {
    color: green
  }

  .negative {
    color: red
  }
</style>