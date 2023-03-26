<template>
  <form v-if="editEntity">
    <input v-model="editEntity.name" type="text" />
  </form>
</template>

<script>

export default {
  watch: {
    categoryData: {
      async handler() {
        console.log("category ", this.categoryData);
        if (this.categoryData) this.loadEditEntityData();
      },
      immediate: true
    }
  },
  methods: {
    async loadEditEntityData() {
      const { id } = this.$route.params;
      await this.$store.dispatch({ type: "loadSwEntityById", id });
    }
  },
  computed: {
    editEntity() {
      return JSON.parse(JSON.stringify(this.$store.getters.editEntity));
    },
    categoryData() {
      return this.$store.getters.categoryData;
    }
  }
};
</script>