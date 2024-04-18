<script setup>
import LinkGrid from '../../components/LinkGrid.vue';
import {ref} from 'vue'

const data = ref([]);
fetch('/data/bookmark/front.json')
    .then(res=>res.json())
    .then(res=>{
        data.value = res;
    })

</script>

<LinkGrid :data="data" :titleLevel="2" />
