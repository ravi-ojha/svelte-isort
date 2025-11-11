<script lang="ts">
  // Complex example with TypeScript and comments
  import { onDestroy, onMount } from 'svelte';
  import { derived, type Writable, writable } from 'svelte/store';

  import axios from 'axios';
  import lodash from 'lodash-es';

  import { API_BASE_URL } from '@core/config';
  import { logger } from '@core/logger';

  import { authenticate } from '@server/auth';
  import { fetchUserData } from '@server/users';

  import { Button, Input, Modal } from '@ui/components';
  import { Alert } from '@ui/feedback';

  import { formatDate, parseDate } from '../utils/date';
  import { validateEmail } from '../utils/validation';
  import type { PageData } from './$types';
  import Card from './Card.svelte';
  import './styles.css';

  export let data: PageData;

  interface User {
    id: number;
    name: string;
    email: string;
  }

  let users: User[] = [];
  let loading = false;

  const userStore: Writable<User[]> = writable([]);

  onMount(async () => {
    loading = true;
    try {
      const response = await fetchUserData();
      users = response.data;
      userStore.set(users);
    } catch (error) {
      logger.error('Failed to fetch users:', error);
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    logger.info('Component destroyed');
  });
</script>

<div class="app">
  <h1>User Management</h1>

  {#if loading}
    <p>Loading...</p>
  {:else}
    {#each users as user (user.id)}
      <Card {user} />
    {/each}
  {/if}

  <Button on:click={() => console.log('Clicked')}>Add User</Button>
</div>

<style lang="scss">
  .app {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }
  }
</style>
