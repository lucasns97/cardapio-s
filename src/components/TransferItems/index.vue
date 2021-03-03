<template>
  <section>
    <el-card :title="title" class="card-container">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
        <el-tooltip effect="dark" content="Editar / Adicionar itens" placement="top">
          <el-button 
            style="float: right; padding: 10px 10px; transform: translateY(-7px)" 
            type="warning" icon="el-icon-edit" 
            @click="dialogVisible = true"
            circle>
          </el-button>
        </el-tooltip>
      </div>
      <EditItems :title="title" :parentVisible="dialogVisible" :parentItems="items" @update-child-visible="handleChildEmitVisible" @update-child-items="handleChildEmitItems"></EditItems>
      <el-transfer
        style="width: 583px"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="Buscar"
        v-model="unselectedIds"
        :titles="['Usar', 'Não Usar']"
        :data="items">
      </el-transfer>
    </el-card>
  </section>
</template>

<script>

import EditItems from '@/components/EditItems/index'
import { getTransferItems, updateTransferItems} from '@/api/items'

export default {
  name: 'TrasnsferItems',
  components: {
    EditItems
  },
  props: ['title'],
  data() {
    return {
      items: [],
      unselectedIds: [],
      dialogVisible: false,
      filterMethod(query, item) {
        return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      }
    };
  },
  beforeMount() {
    this.loadData()
  },
  watch: {
    items: function (val) {
      
      let emitItems = []
      let that      = this

      this.items.forEach(function(item) {
        if (that.unselectedIds.find(id => id == item.id)) {
          console.log('found', item.id)
        } else {
          emitItems.push(item)
        }
      })

      this.$emit('update-child-items', {class: this.title, items: emitItems})
    },

    unselectedIds: function (val) {
      
      let emitItems = []
      let that      = this

      this.items.forEach(function(item) {
        if (that.unselectedIds.find(id => id == item.id)) {
          console.log('found', item.id)
        } else {
          emitItems.push(item)
        }
      })

      this.$emit('update-child-items', {class: this.title, items: emitItems})
    },
  },
  methods: {
    async loadData() {
      this.items = await getTransferItems(this.title)
    },
    handleChildEmitVisible(childVisible) {
      this.dialogVisible = childVisible
    },
    async handleChildEmitItems(childItems) {
      this.items         = childItems
      this.dialogVisible = false

      await updateTransferItems(childItems)
      this.loadData()

      this.$notify({
        title: `${this.title}`,
        message: `Todos os dados atualizados com sucesso.`,
        type: 'success'
      });
    }
  }
}
</script>

<style scoped>
  .card-container {
    width: 623px;
    margin: 20px
  }
</style>