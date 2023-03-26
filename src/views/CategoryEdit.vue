<template>
  <div>
    <form v-if="editEntity" @submit.prevent="save">
      <input v-model="editEntity.name" type="text" />
      <button>Save</button>
    </form>
    
  </div>
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
  methods: {
    async loadEditEntityData() {
      const { id } = this.$route.params;
      await this.$store.dispatch({ type: "loadSwEntityById", id });
    },
    async save() {
      console.log("this.editEntity ", this.editEntity);
      await this.$store.dispatch({
        type: "saveEntity",
        entityToSave: this.editEntity
      });
    },

  },
  computed: {
    editEntity() {
      console.log(
        "this.$store.getters.editEntity ",
        this.$store.getters.editEntity
      );
      return JSON.parse(JSON.stringify(this.$store.getters.editEntity));
    },
    categoryData() {
      return this.$store.getters.categoryData;
    }
  }
};
</script>