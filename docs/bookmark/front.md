<script setup>
import LinkGrid from '@components/LinkGrid.vue';
import data from '@data/bookmark/front.json';

</script>

<LinkGrid :data="data" :titleLevel="2" />
