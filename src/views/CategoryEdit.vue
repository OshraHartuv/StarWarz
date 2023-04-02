<template>
  <v-row justify="center" v-if="editEntity">
    <v-dialog v-model="isDialogOpen" width="1024" persistent>
      <v-card>
        <v-card-text>
          <v-text-field
            v-for="key in editEntityKeys"
            :key="key"
            v-model="editEntity[key]"
            :label="key"
            type="text"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="green-darken-1" variant="text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>



<script>
export default {
  watch: {
    categoryData: {
      handler() {
        if (this.categoryData) this.loadEditEntityData();
        else {
          this.$notify("Oops... Something went wrong");
          this.closeDialog();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      isDialogOpen: true,
      editEntity: null
    };
  },
  methods: {
    loadEditEntityData() {
      const { id } = this.$route.params;
      const { categoryData } = this.$store.getters;
      if (!categoryData || !categoryData.results.length) this.closeDialog();
      const editEntity = categoryData.results.find(entity => entity.id === id);
      if (editEntity) {
        this.editEntity = JSON.parse(JSON.stringify(editEntity));
        this.isDialogOpen = true;
      } else this.closeDialog();
    },
    async save() {
      try {
        await this.$store.dispatch({
          type: "saveEntity",
          entityToSave: this.editEntity
        });
        this.$notify(`Saved ${this.editEntity.name} successfully`);
      } catch (err) {
        console.error(`Error while saving => ${err.message}`);
        this.$notify("Oops... Something went wrong");
      } finally {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.dialog = false;
      this.$router.push({
        name: "CategoryTable",
        params: {
          category: this.$route.params.category,
          filterBy: this.$route.params.filterBy
        }
      });
    }
  },
  computed: {
    editEntityKeys() {
      const keys = Object.keys(this.editEntity);
      return keys.filter(key => key !== "id");
    },
    categoryData() {
      return this.$store.getters.categoryData;
    }
  }
};
</script>