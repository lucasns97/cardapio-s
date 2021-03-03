<template>
  <section>
    <el-dialog
      title="Editar item"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="itemForm" :rules="rules" :disabled="true" label-position="top" ref="itemForm" :hide-required-asterisk="true">
        <el-form-item label="Categoria" prop="class" >
          <el-select v-model="itemForm.class" :placeholder="itemForm.class">
            <el-option label="Acompanhamentos" value="Acompanhamentos"></el-option>
            <el-option label="Condimentos" value="Condimentos"></el-option>
            <el-option label="Misturas" value="Misturas"></el-option>
            <el-option label="Acompanhamentos" value="Sobremesas"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="itemForm" :rules="rules" label-position="top" ref="itemForm" :hide-required-asterisk="true">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="itemForm.name" placeholder="Nome do item"></el-input>
        </el-form-item>
        <el-form-item label="Receita" prop="recipe">
          <el-input v-model="itemForm.recipe" placeholder="Link da receita"></el-input>
        </el-form-item>
        <label for="class" class="el-form-item__label">Ocorrência</label>
        <el-slider
          v-model="itemForm.occurrence"
          :marks="marks">
        </el-slider>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="updateItem('itemForm')">Atualizar</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>


export default {
  name: 'EditItem',
  components: {},
  props: ['parentItem', 'parentVisible'],
  data() {
    return {
      dialogVisible: false,
      itemForm: {},
      rules: {
        name: [
          { required: true, message: 'Por favor, insira o nome do item.', trigger: 'blur' },
        ],
        class: [
          { required: true, message: 'Por favor, insira a categoria do item.', trigger: 'blur' }
        ],
      },
      marks: {
        25: '25%',
        50: '50%',
        75: '75%',
      },
      customColors: [
        {color: '#fe506b', percentage: 22.5},
        {color: '#e6ab39', percentage: 45},
        {color: '#6078ff', percentage: 67.5},
        {color: '#6078ff', percentage: 90},
      ]
    };
  },
  mounted() {},
  watch: {
    parentVisible: function (val) {
      this.dialogVisible = this.parentVisible

      this.itemForm = Object.assign({}, this.parentItem)
    },
    dialogVisible: function (val) {
      this.$emit('update-child-visible', this.dialogVisible)
    },
  },
  methods: {
    updateItem(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.itemForm.label = this.itemForm.name

          that.$emit('update-child-item', Object.assign({}, this.itemForm))
          that.$emit('update-child-visible', false)
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose(done) {
      this.$confirm('Deseja realmente fechar a edição? As alterações não serão mantidas.')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>

<style scoped>
</style>