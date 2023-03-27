<template>
  <v-row justify="center" v-if="editEntity">
    <v-dialog v-model="isDialogOpen" width="1024" persistent>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col >
                <v-text-field
                  v-for="key in editEntityKeys"
                  :key="key"
                  v-model="editEntity[key]"
                  :label="key"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
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
      async handler() {
        if (this.categoryData) this.loadEditEntityData();
      },
      immediate: true
    }
  },
  data() {
    return {
      isDialogOpen: true
    };
  },
  methods: {
    async loadEditEntityData() {
      const { id } = this.$route.params;
      try {
        await this.$store.dispatch({ type: "loadSwEntityById", id });
      } catch (err) {
        console.error(`Error while loading entity => ${err.message}`);
        //Notification
        this.$router.push({
          name: "CategoryTable",
          params: {
            category: this.$route.params.category,
            filterBy: this.$route.params.filterBy
          }
        });
      }
    },
    async save() {
      try {
        await this.$store.dispatch({
          type: "saveEntity",
          entityToSave: this.editEntity
        });
      } catch (err) {
        console.error(`Error while saving => ${err.message}`);
        //Notification
      } finally {
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
    editEntity() {
      const entityCopy = JSON.parse(
        JSON.stringify(this.$store.getters.editEntity)
      );
      return entityCopy;
    },
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