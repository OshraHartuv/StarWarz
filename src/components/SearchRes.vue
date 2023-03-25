<template>
  <!--     <v-navigation-drawer v-model="drawer" location="bottom" temporary>
      <v-list :items="items"></v-list>
    </v-navigation-drawer> -->
  <v-row>
    <v-col v-for="(categoryResults, category) in swData" :key="category" cols="12">
      <v-card>
        <v-list>
          <v-list-subheader>{{ category }}</v-list-subheader>
          <div v-if="categoryResults && categoryResults.length">
            <div v-for="result in categoryResults" :key="result">
              <v-list-item>
                <v-list-item-title>{{result.name}}</v-list-item-title>
              </v-list-item>
            </div>
            <v-list-item>
              <v-list-item-title @click="setCategory(category)">see more {{ category }}</v-list-item-title>
            </v-list-item>
          </div>
          <div v-else>
            <v-list-item>
              <v-list-item-title>No matching results</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
  

</template>

<script>
export default {
  props: {
    swData: {
      type: Object
    },
    filterBy:{
      type:String
    }
  },
  methods:{
    setCategory(category){
      this.$emit('setCategory', category)
    }
  }

};
</script>