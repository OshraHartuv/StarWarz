<template>
  <v-list v-show="!isCategoriesDataEmpty" transition="scale-transition" max-height="70vh">
    <v-list-item>
      <v-list-subheader v-if="isCategoryDataEmpty">No matching results</v-list-subheader>
      <div v-else v-for="(categoryResults, category) in swData" :key="category" cols="12">
        <v-list v-if="categoryResults && categoryResults.length">
          <v-list-item-subtitle>{{ category }}</v-list-item-subtitle>
          <v-divider></v-divider>
          <v-list-item
            @click="goToCategoryPage(category)"
            v-for="result in categoryResults"
            :key="result"
          >
            <span v-html="highlightSearchTerm(result.name)"></span>
          </v-list-item>
          <v-list-item
            class="text-right"
            @click="goToCategoryPage(category)"
          >View all {{ category }}</v-list-item>
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
      this.$router.push({
        name: "CategoryTable",
        params: { category, filterBy: this.filterBy }
      });
    },
    highlightSearchTerm(name) {
      if (!name) return;
      return name.replace(
        new RegExp(this.filterBy, "gi"),
        '<span class="font-weight-bold">$&</span>'
      );
    }
  },
  computed: {
    isCategoriesDataEmpty() {
      const searchResults = Object.values(this.swData);
      return searchResults.length ? false : true;
    },
    isCategoryDataEmpty() {
      const searchResults = Object.values(this.swData);
      if (!searchResults.length) return
      return searchResults.every(result => !result.length) ? true : false;
    }
  }
};
</script>