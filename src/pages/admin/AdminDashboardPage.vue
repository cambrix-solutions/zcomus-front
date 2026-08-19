<template>
  <div>
    <div class="content-header">
      <div>
        <h2 class="content-title card-title">Dashboard</h2>
        <p>Marketplace overview</p>
      </div>
    </div>
    <div class="row">
      <div v-for="card in cards" :key="card.label" class="col-lg-3 col-md-6">
        <div class="card card-body mb-30">
          <article class="icontext">
            <div class="text">
              <h6 class="mb-5">{{ card.label }}</h6>
              <span class="text-muted">{{ card.value }}</span>
            </div>
          </article>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-8 col-lg-12">
        <div class="card mb-4">
          <article class="card-body">
            <h5 class="card-title">Recent orders</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="o in orders" :key="o.id">
                    <td>#{{ o.id }}</td>
                    <td>{{ o.customer }}</td>
                    <td>
                      <span class="badge rounded-pill" :class="o.badge">{{ o.status }}</span>
                    </td>
                    <td>${{ o.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
      <div class="col-xl-4 col-lg-12">
        <div class="card mb-4">
          <article class="card-body">
            <h5 class="card-title">Quick links</h5>
            <ul class="menu-aside" style="position: static; border: 0; box-shadow: none">
              <li class="menu-item"><router-link class="menu-link" to="/admin/products"><span class="text">Manage products</span></router-link></li>
              <li class="menu-item"><router-link class="menu-link" to="/admin/orders"><span class="text">View orders</span></router-link></li>
              <li class="menu-item"><router-link class="menu-link" to="/admin/sellers"><span class="text">Sellers</span></router-link></li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  { label: 'Revenue', value: '$13,456.70' },
  { label: 'Orders', value: '1,280' },
  { label: 'Products', value: '486' },
  { label: 'Sellers', value: '64' },
];

const orders = [
  { id: 1001, customer: 'Ada Lovelace', status: 'Delivered', total: '256.00', badge: 'alert-success' },
  { id: 1002, customer: 'Alan Turing', status: 'Pending', total: '89.50', badge: 'alert-warning' },
  { id: 1003, customer: 'Grace Hopper', status: 'Cancel', total: '120.00', badge: 'alert-danger' },
  { id: 1004, customer: 'Katherine Johnson', status: 'Delivered', total: '64.20', badge: 'alert-success' },
];
</script>
