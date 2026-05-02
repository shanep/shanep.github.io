<script setup lang="ts">
import { useData } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <a :href="theme.officeHoursUrl" target="_blank" rel="noopener noreferrer">
    Book an appointment
  </a>
</template>
