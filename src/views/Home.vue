<template>
  <section>
    <v-responsive class="mx-auto" max-width="344">
      <v-text-field
        label="search"
        variant="underlined"
        v-model="filterBy"
        @input="debouncedSetFilterBy"
      />
    </v-responsive>
    <List v-if="swData" :swData="swData" :filterBy="getFilterBy" @setCategory="setCategory"></List>
  </section>
</template>

<script>
import { utilService } from "@/services/util-service.js";
import List from "@/components/SearchRes.vue";

export default {
  data() {
    return {
      filterBy: "",
      drawer: false,
      group: null,
      items: [
        {
          title: "Foo",
          value: "foo"
        },
        {
          title: "Bar",
          value: "bar"
        },
        {
          title: "Fizz",
          value: "fizz"
        },
        {
          title: "Buzz",
          value: "buzz"
        }
      ]
    };
  },
  watch: {
    group() {
      this.drawer = false;
    }
  },
  created() {
    this.debouncedSetFilterBy = utilService.debounce(this.setFilterBy, 200);
  },
  methods: {
    setFilterBy() {
      this.drawer = this.filterBy ? true : false;
      this.$store.dispatch({ type: "setFilter", filterBy: this.filterBy });
    },
    setCategory(category){
      this.$router.push(`/${category}/${this.getFilterBy}`)
    }
  },
  computed: {
    swData() {
      return this.$store.getters.swSearchResults;
    },
    getFilterBy() {
      return this.$store.getters.filterBy;
    }
  },
  components: { List }
};
</script>