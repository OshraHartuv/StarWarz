<template>
  <section style="height: 100%">
    <v-responsive class="mx-auto" max-width="444" height="100%">
      <v-text-field
        label="search"
        variant="underlined"
        v-model="filterBy"
        @input="debouncedSetFilterBy"
      ></v-text-field>
      <div class="place-holder" style="position: relative; margin: 0 auto; "></div>
      <v-menu
        v-model="showMenu"
        attach=".place-holder"
        location="top"
        min-width="100%"
        :close-on-content-click="false"
        :persistent="true"
        min-height="100%"
      >
        <List v-if="swData" :swData="swData" :filterBy="getFilterBy"></List>
      </v-menu>
    </v-responsive>
    <!-- <List v-if="swData" :swData="swData" :filterBy="getFilterBy"></List> -->
  </section>
</template>

<script>
import { utilService } from "@/services/util-service.js";
import List from "@/components/SearchRes.vue";

export default {
  data() {
    return {
      filterBy: "",
      showMenu: false,
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

  async created() {
    this.debouncedSetFilterBy = utilService.debounce(this.setFilterBy, 200);
    this.$store.commit({ type: "setCategory", category: "" });
  },
  methods: {
    setFilterBy() {
      this.showMenu = this.filterBy ? true : false;
      console.log("this.showMenu ", this.showMenu);
      this.$store.dispatch({ type: "setFilter", filterBy: this.filterBy });
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