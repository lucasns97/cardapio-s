<template>
  <section>
    <el-row type="flex">
      <el-col class="transfer-col" :span="100">
        <TransferItems v-for="(transferClass, idx) in transferClasses" :key="idx" :title="transferClass.name" @update-child-items="handleChildEmitItems"></TransferItems>
      </el-col>
      <el-col>
        <AssignMenu :assignedItems="childItems"></AssignMenu>
      </el-col>
    </el-row>
  </section>
</template>

<script>

import TransferItems from '@/components/TransferItems/index'
import AssignMenu from '@/components/AssignMenu/index'

export default {
  name: 'MakeMenu',
  components: {
    TransferItems,
    AssignMenu
  },
  data() {
    return {
      childItems: {},
      transferClasses: [
        {
          name: "Condimentos",
        },
        {
          name: "Acompanhamentos",
        },
        {
          name: "Misturas"
        },
        {
          name: "Sobremesas"
        }
      ]
    }
  },
  watch: {},
  methods: {
    handleChildEmitItems(vals) {
      let itemsClass = vals.class
      let itemsList  = vals.items

      this.childItems[itemsClass] = itemsList
    }
  }
}
</script>

<style scoped>
  .transfer-col {
    border-right: 1px solid coral;
    margin-right: 20px;
  }
</style>