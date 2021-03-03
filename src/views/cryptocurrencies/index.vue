<template>
  <section>
    <el-row class="selector-container">
      <el-checkbox-group v-model="selectedCoinKeys">
        <el-checkbox-button v-for="coinKey in availableCoinKeys" :label="coinKey" :key="coinKey">{{coinKey}}</el-checkbox-button>
      </el-checkbox-group>
    </el-row>
    <el-row>
      <el-col :lg="24" :xl="12" v-for="coinKey in selectedCoinKeys" :key="coinKey" class="coin-card-container">
        <CoinCard :coinKey="coinKey"></CoinCard>
      </el-col>
    </el-row>
  </section>
</template>

<script>

import CoinCard from '@/components/CoinCard/index'

export default {
  name: 'Criptocurrencies',
  components: {
    CoinCard
  },
  data() {
    return {
      selectedCoinKeys: ['BTC', 'ETH'],
      availableCoinKeys: ['BTC', 'ETH', 'CHZ', 'BCH', 'LINK', 'LTC', 'PAXG', 'USDC', 'WBX', 'XRP']
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
  .coin-card-container {
    padding: 10px
  }

  .selector-container {
    padding-left: 10px;
    padding-right: 10px
  }
</style>