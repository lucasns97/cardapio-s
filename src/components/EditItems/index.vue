<template>
  <section>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-table
        :data="items"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Nome">
        </el-table-column>
        <el-table-column
          prop="occurrence"
          label="Ocorrência">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.occurrence" :color="customColors" :show-text="false"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="70"
          prop="recipe"
          label="Receita">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.recipe" class="item" effect="light" content="Ver receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.recipe" target="_blank"></el-link>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="Sem receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.recipe" target="_blank" disabled></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operações"
          width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Editar" placement="top">
              <el-button
                @click.native.prevent="editRow(scope.$index, items)"
                size="small"
                type="primary"
                icon="el-icon-setting">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Deletar" placement="top">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, items)"
                size="small"
                type="danger"
                icon="el-icon-delete">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center; margin-top: 10px">
        <el-button style="width: 100%" icon="el-icon-plus" type="success" @click="createItemVisible = true">Adicionar</el-button>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Cancelar</el-button>
        <el-button type="primary" @click="handleSaveItems">Salvar</el-button>
      </span>
    </el-dialog>
    <EditItem :parentItem="selectedItem" :parentVisible="editItemVisible" @update-child-visible="handleChildEditVisible" @update-child-item="handleChildEditItem"></EditItem>
    <CreateItem :parentVisible="createItemVisible" :itemClass="title" @update-child-visible="handleChildCreateVisible" @update-child-item="handleChildCreateItem"></CreateItem>
  </section>
</template>

<script>

import EditItem from '@/components/EditItem/index' 
import CreateItem from '@/components/CreateItem/index' 

export default {
  name: 'EditItems',
  components: {
    EditItem,
    CreateItem
  },
  props: ['title', 'parentVisible', 'parentItems'],
  data() {
    return {
      dialogVisible: false,
      items: [],
      selectedItem: {},
      editItemVisible: false,
      createItemVisible: false,
      customColors: [
        {color: '#fe506b', percentage: 22.5},
        {color: '#e6ab39', percentage: 45},
        {color: '#6078ff', percentage: 67.5},
        {color: '#6078ff', percentage: 90},
      ]
    };
  },
  mounted() {
    
  },
  watch: {
    parentVisible: function (val) {
      this.dialogVisible = this.parentVisible

      if (this.dialogVisible == true) {
        this.items = []
        var that = this

        this.parentItems.forEach(item => {
          that.items.push(item)
        })
      }
    },
    dialogVisible: function (val) {
      this.$emit('update-child-visible', this.dialogVisible)
    },
  },
  methods: {
    handleChildEditVisible(childVisible) {
      this.editItemVisible = childVisible
    },
    handleChildCreateVisible(childVisible) {
      this.createItemVisible = childVisible
    },
    handleChildEditItem(childItem) {

      let newItems = []
      this.items.forEach(function(item) {
        if (item.id == childItem.id) {
          newItems.push(childItem)
        }
        else {
          newItems.push(item)
        }
      })

      this.items = newItems
    },
    handleChildCreateItem(childItem) {
      this.items.push(childItem)
    },
    editRow(index, rows) {
      this.selectedItem    = rows[index];
      this.editItemVisible = true
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handleClose(done) {
      this.$confirm('Deseja realmente fechar a edição? As alterações não serão mantidas.')
        .then(_ => {
          this.$emit('update-child-visible', false)
          done();
        })
        .catch(_ => {});
    },
    handleSaveItems() {
      this.$emit('update-child-items', this.items)
      this.$emit('update-child-visible', false)
    }
  }
}
</script>

<style scoped>
</style>