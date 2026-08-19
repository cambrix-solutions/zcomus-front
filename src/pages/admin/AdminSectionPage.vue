<template>
  <div>
    <div class="content-header">
      <div>
        <h2 class="content-title card-title">{{ title }}</h2>
        <p>Ecom dashboard section · wire Laravel admin APIs later</p>
      </div>
      <div>
        <router-link v-if="title === 'Products'" class="btn btn-primary" to="/admin/products">
          <i class="material-icons md-plus" /> Create new
        </router-link>
      </div>
    </div>

    <div class="card mb-4">
      <header class="card-header">
        <div class="row align-items-center">
          <div class="col-md-6 col-12 me-auto mb-md-0 mb-3">
            <h5 class="mb-0">{{ title }} list</h5>
          </div>
          <div class="col-md-3 col-6">
            <input type="text" placeholder="Search…" class="form-control" />
          </div>
        </div>
      </header>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.id }}</td>
                <td><b>{{ row.name }}</b></td>
                <td><span class="badge rounded-pill alert-success">Active</span></td>
                <td>{{ row.date }}</td>
                <td class="text-end">
                  <a href="#" class="btn btn-sm btn-brand rounded font-sm mt-15" @click.prevent>View</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ title: string }>();

const rows = computed(() =>
  Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: `${props.title} item ${i + 1}`,
    date: '15.08.2026',
  })),
);
</script>
