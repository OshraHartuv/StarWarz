<template>
  <div v-if="entities && entities.length">
    <v-data-table-server
      :headers="headers"
      :items="entities"
      :loading="loading"
      :items-length="0"
      item-value="name"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <div
            class="v-data-table__td v-data-table-column--align-end action"
            v-bind="props"
            :elevation="isHovering ? 12 : 2"
            :class="{ 'on-hover': isHovering }"
          >
            <td>
              <v-btn
                class="mr-5 btn"
                :class="{ 'show-btn': isHovering, 'hide-btn': !isHovering }"
                @click="editEntity(item.raw)"
              >Edit</v-btn>
            </td>
            <td>
              <v-btn
                class="btn"
                :class="{ 'show-btn': isHovering, 'hide-btn': !isHovering }"
                @click="removeEntity(item.raw)"
              >Delete</v-btn>
            </td>
          </div>
        </v-hover>
      </template>

      <template v-slot:bottom>
        <v-container>
          <v-row class="my-3 flex justify-center">
            <v-btn
              color="green-darken-1"
              class="mr-5"
              variant="outlined"
              @click="getPage(-1)"
              v-if="hasPrevPage"
            >Previous page</v-btn>
            <v-btn
              color="green-darken-1"
              variant="outlined"
              @click="getPage(1)"
              v-if="hasNextPage"
            >Next page</v-btn>
          </v-row>
        </v-container>
      </template>
    </v-data-table-server>
    <RouterView />
  </div>
</template>

<script>
import { utilService } from "@/services/util.service.js";

export default {
  data() {
    return {
      loading: true
    };
  },
  async created() {
    this.loading = true;
    const filterByParam = this.$route.params.filterBy;
    const categoryByParam = this.$route.params.category;
    if (filterByParam !== this.filterByInStore)
      this.$store.commit({ type: "setFilter", filterBy: filterByParam });
    try {
      await this.$store.dispatch({
        type: "setCategory",
        category: categoryByParam
      });
    } catch (err) {
      console.error(`Error while setting category => ${err.message}`);
      this.$notify("Oops... Something went wrong");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async getPage(diff) {
      this.loading = true;
      try {
        await this.$store.dispatch({ type: "setPage", diff });
        this.totalDesserts = this.entities.length;
      } catch (err) {
        console.error(`Error while setting page => ${err.message}`);
        this.$notify("Oops... Something went wrong");
      } finally {
        this.loading = false;
      }
    },
    async removeEntity({ id }) {
      this.loading = true;
      try {
        await this.$store.dispatch({
          type: "removeEntity",
          id
        });
      } catch (err) {
        console.error(`Error while removing entity => ${err.message}`);
        this.$notify("Oops... Something went wrong");
      } finally {
        this.loading = false;
      }
    },
    editEntity({ id }) {
      this.$router.push({
        name: "CategoryEdit",
        params: {
          category: this.$route.params.category,
          filterBy: this.$route.params.filterBy,
          id
        }
      });
    }
  },
  computed: {
    entities() {
      return this.$store.getters.categoryEntitiesPerPage;
    },
    headers() {
      const headers = Object.keys(this.entities[0])
        .filter(key => key !== "id")
        .map((key, idx) => {
          return {
            title: utilService.formatString(key),
            align: idx ? "end" : "start",

            key: key
          };
        });
      headers.push({
        title: "Actions",
        align: "end",
        key: "actions",
        sortable: false,
        colspan: 2
      });
      return headers;
    },
    filterByInStore() {
      return this.$store.getters.filterBy;
    },
    hasNextPage() {
      return this.$store.getters.hasNextPage;
    },
    hasPrevPage() {
      return this.$store.getters.hasPrevPage;
    }
  }
};
</script>

<style scoped>
.btn {
  transition: opacity 0.2s linear;
}

.show-btn {
  opacity: 1;
}
.hide-btn {
  opacity: 0;
}

.action {
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>