<template>
  <v-row>
    <v-col v-if="allCategoriesAreEmpty">
      <v-card>
        <v-list>
          <v-list-subheader>No matching results</v-list-subheader>
        </v-list>
      </v-card>
    </v-col>
    <v-col v-else v-for="(categoryResults, category) in swData" :key="category" cols="12">
      <div v-if="categoryResults && categoryResults.length">
        <v-list>
          <v-list-item-title>{{ category }}</v-list-item-title>
          <div v-for="result in categoryResults" :key="result">
            <v-list-item>
              <v-list-item-title>{{result.name}}</v-list-item-title>
            </v-list-item>
          </div>

          <v-list-subheader
            @click="$router.push(`/${category}/${filterBy}`)"
          >View all {{ category }}</v-list-subheader>
        </v-list>
      </div>
    </v-col>
  </v-row>
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
  computed: {
    allCategoriesAreEmpty() {
      const searchResults = Object.values(this.swData);
      return searchResults.every(result => !result.length);
    }
  }
};
</script>