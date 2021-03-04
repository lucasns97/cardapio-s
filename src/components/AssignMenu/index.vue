<template>
  <section>
    <el-row style="margin-top: 22px">
      <el-button v-loading="loading1" icon="el-icon-magic-stick" @click="generateMenu('Dia')" plain type="primary">Gerar Dia</el-button>
      <el-button v-loading="loading2" icon="el-icon-magic-stick" @click="generateMenu('Semana')" plain type="success">Gerar Semana</el-button>
      <el-button v-loading="loading3" icon="el-icon-magic-stick" @click="generateMenu('Mês')" plain type="warning">Gerar Mês</el-button>
      <a style="border-left: 1px solid coral; margin: 10px"></a>
      <el-button icon="el-icon-remove-outline" @click="showMenu = false" plain>Limpar</el-button>
      <a style="border-left: 1px solid coral; margin: 10px"></a>
      <el-switch
        v-model="switchCase"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="Apenas Almoço"
        active-value="single"
        inactive-text="Almoço e Janta"
        inactive-value="double"
        >
      </el-switch>
    </el-row>
    <el-row>
      <transition name="el-zoom-in-top">
        <ShowMenu v-show="showMenu" :typeMenu="typeMenu" :menuList="menuList"></ShowMenu>
      </transition>
    </el-row>
  </section>
</template>

<script>

import ShowMenu from '@/components/ShowMenu/index'
import { formatDate } from '@/utils/date'

export default {
  name: 'AssignMenu',
  components: {
    ShowMenu
  },
  props: ['assignedItems'],
  data() {
    return {
      showMenu: false,
      typeMenu: '',
      loading1: false,
      loading2: false,
      loading3: false,
      switchCase: 'single',
      menuList: [],
    };
  },
  mounted() {
    
  },
  watch: {},
  methods: {
    generateMenu(typeMenu) {
      
      if (typeMenu == 'Dia') this.loading1 = true
      if (typeMenu == 'Semana') this.loading2 = true
      if (typeMenu == 'Mês') this.loading3 = true

      this.showMenu = false
      var that      = this

      setTimeout(async function() { 
        that.typeMenu = typeMenu
        that.showMenu = true

        that.menuList = await that.getRandomMenuList()

        that.loading1 = false
        that.loading2 = false
        that.loading3 = false

      }, 150);
    },

    async getRandomMenuList() {

      let size = 0

      if (this.typeMenu == 'Dia') {
        size = 1
      }

      else if (this.typeMenu == 'Semana') {
        size = 7
      }

      else if (this.typeMenu == 'Mês') {
        size = 30
      }

      var menuList = []
      var that     = this

      return new Promise(async function(resolve, reject) {

        let nowTs = new Date()
        nowTs     = nowTs.getTime()

        for (let i = 0; i < size; i++) {

          // Almoço
          let acompanhamento = await that.getRandomItem(that.assignedItems['Acompanhamentos'])
          let mistura        = await that.getRandomItem(that.assignedItems['Misturas'])
          let condimento     = await that.getRandomItem(that.assignedItems['Condimentos'])
          let sobremesa      = await that.getRandomItem(that.assignedItems['Sobremesas'])

          let menu = {
            date: formatDate(new Date(nowTs + 1000*60*60*24*i), false),
            refeicao: 'Almoço',
            acompanhamento: acompanhamento.name,
            mistura: mistura.name,
            condimento: condimento.name,
            sobremesa: sobremesa.name,
            acompanhamentoRecipe: acompanhamento.recipe,
            misturaRecipe: mistura.recipe,
            condimentoRecipe: condimento.recipe,
            sobremesaRecipe: sobremesa.recipe
          }

          menuList.push(menu)

          if (that.switchCase == 'double') {

            // Janta
            acompanhamento = await that.getRandomItem(that.assignedItems['Acompanhamentos'])
            mistura        = await that.getRandomItem(that.assignedItems['Misturas'])
            condimento     = await that.getRandomItem(that.assignedItems['Condimentos'])
            sobremesa      = await that.getRandomItem(that.assignedItems['Sobremesas'])

            menu = {
              date: formatDate(new Date(nowTs + 1000*60*60*24*i), false),
              refeicao: 'Jantar',
              acompanhamento: acompanhamento.name,
              mistura: mistura.name,
              condimento: condimento.name,
              sobremesa: sobremesa.name,
              acompanhamentoRecipe: acompanhamento.recipe,
              misturaRecipe: mistura.recipe,
              condimentoRecipe: condimento.recipe,
              sobremesaRecipe: sobremesa.recipe
            }

            menuList.push(menu)

          }

          if (i == size-1) {
            resolve(menuList)
          }
        }

      })
    },

    getRandomItem(items) {

      return new Promise(function(resolve, reject) {
        
        let occurenceItemList = []
        let count = 0

        items.forEach(function(item) {

          let itemOccurrence = Array(item.occurrence).fill(item)
          occurenceItemList  = occurenceItemList.concat(itemOccurrence)
          count += 1

          if (count == items.length) {
            const randomIndex = Math.floor(Math.random() * occurenceItemList.length);
            resolve(occurenceItemList[randomIndex])
          }
        })

      })
    }
  }
}
</script>

<style scoped>
 .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
</style>