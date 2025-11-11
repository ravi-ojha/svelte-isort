<script context="module">
  // Module-level imports
  import type { Load } from '@sveltejs/kit';

  import { API_URL } from '@core/constants';

  import axios from 'axios';

  import { browser } from '$app/environment';

  export const load: Load = async () => {
    if (browser) {
      const response = await axios.get(API_URL);
      return { props: { data: response.data } };
    }
    return { props: {} };
  };
</script>

<script>
  // Component-level imports
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { logger } from '@core/logger';

  import { Button } from '@ui/components';

  import { formatDate } from '../utils/date';
  import Header from './Header.svelte';

  export let data = {};

  const state = writable({});

  onMount(() => {
    logger.info('Component mounted with data:', data);
  });
</script>

<div class="container">
  <Header />
  <main>
    <h1>Data: {JSON.stringify(data)}</h1>
    <Button>Action</Button>
  </main>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
