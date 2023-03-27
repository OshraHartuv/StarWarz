<template>
  <div v-if="entities && entities.length">
    <v-data-table-server
      :headers="headers"
      hide-default-footer
      :items="entities"
      :loading="loading"
      item-value="name"
      :items-length="0"
      class="elevation-1"
    >
      <!-- <template v-slot:items="{ items }">
        <v-hover v-slot="{ isHovering, props }" update:modelValue>

          <div v-bind="props" :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }">
            <v-data-table-rows :items="items"></v-data-table-rows>

          </div>
        </v-hover>
      </template>-->

      <!-- <template v-slot:headers="{title}">
          <th v-for="header in headers" :key="header.title"><td>{{ header.title }}</td><td>Actions</td></th>
      </template>-->
      <!-- 
      <template v-slot:item="{item}">
        <tr @mouseover="selectItem(item)" @mouseleave="unSelectItem(item)">
          <td v-for="key in entityKeys" :key="key">{{ item.raw[key] }}</td>
          {{ item[key] }}
          <td>
              <v-btn  :class="{ 'show-btn': item === selectedItem, 'hide-btn': item !== selectedItem }" class="mr-5 btn" @click="editEntity(item.raw)">Edit</v-btn>
              <v-btn  :class="{ 'show-btn': item === selectedItem, 'hide-btn': item !== selectedItem }" class="btn" @click="removeEntity(item.raw)">Delete</v-btn>
          </td>
        </tr>
      </template>-->

      <template v-slot:item.actions="{ item }">
        <v-hover v-slot="{ isHovering, props }">
          <div v-bind="props" :elevation="isHovering ? 12 : 2" :class="{ 'on-hover': isHovering }">
            <td class="v-data-table__td v-data-table-column--align-end">
              <v-btn
                class="mr-5 btn"
                :class="{ 'show-btn': isHovering, 'hide-btn': !isHovering }"
                @click="editEntity(item.raw)"
              >Edit</v-btn>
            </td>
            <td class="v-data-table__td v-data-table-column--align-end">
            <!-- <td> -->
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
              <v-btn color="green-darken-1" class="mr-5" variant="outlined" @click="getPage(-1)" v-if="hasPrevPage">Previous page</v-btn>
              <v-btn color="green-darken-1" variant="outlined" @click="getPage(1)" v-if="hasNextPage">Next page</v-btn>
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
      // selectedItem: null,
      options: {
        pageCount: 1
      },
      itemsPerPage: 5,
      pageIdx: 1,
      totalItems: 0,
      loading: true
    };
  },
  async created() {
    this.loading = true;
    const filterByParam = this.$route.params.filterBy;
    const categoryByParam = this.$route.params.category;
    if (filterByParam !== this.filterBy)
      this.$store.commit({ type: "setFilter", filterBy: filterByParam });
    try {
      await this.$store.dispatch({
        type: "setCategory",
        category: categoryByParam
      });
    } catch (err) {
      console.error(`Error while setting category => ${err.message}`);
      // Notification
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
        // Notification
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
        //Notification
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
    // selectItem(item) {
    //   this.selectedItem = item;
    // },
    // unSelectItem(item) {
    //   this.selectedItem = false;
    // }
  },
  computed: {
    entities() {
      return this.$store.getters.categoryEntitiesPerPage;
    },
    // entityKeys() {
    //   const keys =  Object.keys(this.entities[0]).filter(key => key !== "id")
    //   keys.push('Actions')
    //   return keys
    // },
    headers() {
      const headers = Object.keys(this.entities[0])
        .filter(key => key !== "id")
        .map((key, idx) => {
          return {
            title: utilService.formatString(key),
            align: idx ? "end" : "start",
            sortable: true,
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
    filterBy() {
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
</style>