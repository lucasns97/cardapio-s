<template>
  <section>
    <el-card class="show-menu-card">
      <div slot="header" class="clearfix">
        <span>{{this.typeMenu}}</span>
      </div>
      <el-table
        :data="menuList"
        style="width: 100%"
        :stripe="true">
        <el-table-column
          prop="date"
          label="Dia">
        </el-table-column>
        <el-table-column
          prop="refeicao"
          label="Refeição">
        </el-table-column>
        <el-table-column
          prop="acompanhamento"
          label="Acompanhamento">
          <template slot-scope="scope">
            {{scope.row.acompanhamento}}
            <el-tooltip v-if="scope.row.acompanhamentoRecipe" class="item" effect="light" content="Ver receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.acompanhamentoRecipe" target="_blank"></el-link>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="Sem receita" placement="top">
              <el-link icon="el-icon-top-right" target="_blank" disabled></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="condimento"
          label="Condimento">
          <template slot-scope="scope">
            {{scope.row.condimento}}
            <el-tooltip v-if="scope.row.condimentoRecipe" class="item" effect="light" content="Ver receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.condimentoRecipe" target="_blank"></el-link>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="Sem receita" placement="top">
              <el-link icon="el-icon-top-right" target="_blank" disabled></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="mistura"
          label="Mistura">
          <template slot-scope="scope">
            {{scope.row.mistura}}
            <el-tooltip v-if="scope.row.misturaRecipe" class="item" effect="light" content="Ver receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.misturaRecipe" target="_blank"></el-link>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="Sem receita" placement="top">
              <el-link icon="el-icon-top-right" target="_blank" disabled></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="sobremesa"
          label="Sobremesa">
          <template slot-scope="scope">
            {{scope.row.sobremesa}}
            <el-tooltip v-if="scope.row.sobremesaRecipe" class="item" effect="light" content="Ver receita" placement="top">
              <el-link icon="el-icon-top-right" :href="scope.row.sobremesaRecipe" target="_blank"></el-link>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="light" content="Sem receita" placement="top">
              <el-link icon="el-icon-top-right" target="_blank" disabled></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>

export default {
  name: 'ShowMenu',
  components: {},
  props: ['selectedMenus', 'typeMenu', 'menuList'],
  data() {
    return {
      showMenu: false,
    };
  },
  mounted() {
    
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
 .show-menu-card {
    margin-top: 20px
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>