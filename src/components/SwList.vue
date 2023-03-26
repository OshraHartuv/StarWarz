<template>
  <v-list v-show="!allDataIsEmpty" transition="scale-transition">
    <v-list-item>
      <v-list-subheader v-if="allCategoriesAreEmpty">No matching results</v-list-subheader>
      <div v-else v-for="(categoryResults, category) in swData" :key="category" cols="12">
        <v-list v-if="categoryResults && categoryResults.length">
          <v-list-item-subtitle>{{ category }}</v-list-item-subtitle>
          <v-divider></v-divider>
          <v-list-item
           
            @click="goToCategoryPage(category)"
            v-for="result in categoryResults"
            :key="result"
          >{{result.name}}</v-list-item>
          <v-list-item color="red" @click="goToCategoryPage(category)">View all {{ category }}</v-list-item>
        </v-list>
      </div>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    swData: {
      type: Object
    },
    filterBy: {
      type: String
    }
  },
  methods: {
    goToCategoryPage(category) {
      this.$router.push(`/${category}/${this.filterBy}`);
    }
  },
  computed: {
    allCategoriesAreEmpty() {
      const searchResults = Object.values(this.swData);
      return searchResults.every(result => !result.length);
    },
    allDataIsEmpty() {
      const searchResults = Object.values(this.swData);
      return !searchResults.length;
    }
  }
};
</script>