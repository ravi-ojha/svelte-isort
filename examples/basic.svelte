<script>
  // Example Svelte component with unsorted imports
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import axios from 'axios';

  import { logger } from '@core/logger';

  import { createServer } from '@server/api';

  import { Button } from '@ui/button';

  import utils from '../utils';
  import Component from './Component.svelte';

  let count = 0;
  const store = writable(0);

  onMount(() => {
    logger.info('Component mounted');
  });

  function increment() {
    count += 1;
  }
</script>

<main>
  <h1>Counter: {count}</h1>
  <button on:click={increment}>Increment</button>
  <Button>Click me</Button>
  <Component />
</main>

<style>
  main {
    text-align: center;
    padding: 2em;
  }

  h1 {
    color: #ff3e00;
    font-size: 2em;
  }
</style>
