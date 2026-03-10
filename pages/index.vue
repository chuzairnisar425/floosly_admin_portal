<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">

    <Transition name="fade" mode="out-in">

      <!-- Loading Screen -->
      <div
        v-if="isLoading"
        key="loading"
        class="fixed inset-0 bg-gradient-to-br from-primary-600 to-primary-700 flex flex-col items-center justify-center z-50"
      >
        <!-- Animated Logo -->
        <div class="mb-8 animate-bounce">
          <svg class="h-24 w-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h1 class="text-4xl font-bold text-white mb-2">Flossly</h1>
        <p class="text-white/80 mb-8">Loading Admin Portal...</p>

        <!-- Progress bar -->
        <div class="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-white rounded-full transition-all duration-500 ease-out"
            :style="{ width: loadingProgress + '%' }"
          />
        </div>

        <p class="text-white/60 text-sm mt-6">{{ loadingMessage }}</p>
      </div>

      <!-- Main Content -->
      <div v-else key="content" class="w-full text-center px-4">

        <div class="mb-6 animate-fade-in">
          <svg class="h-20 w-20 text-primary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h1 class="text-5xl font-bold text-primary-600 mb-4">
          Flossly Admin Portal
        </h1>

        <p class="text-xl text-gray-600 mb-8">
          Dental Practice Management System
        </p>

        <div class="space-x-4 mb-12">
          <NuxtLink
            to="/admin"
            class="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition transform hover:scale-105 shadow-lg"
          >
            Go to Dashboard →
          </NuxtLink>

          <NuxtLink
            to="/admin/clinics"
            class="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition transform hover:scale-105 shadow border border-primary-200"
          >
            View Clinics
          </NuxtLink>
        </div>

      </div>

    </Transition>

  </div>
</template>
<script setup>
definePageMeta({
  layout: 'default'
})

const clinicStore = useClinicStore()
const userStore = useUserStore()

const isLoading = ref(true)
const loadingProgress = ref(0)
const loadingMessage = ref('Initializing...')

const stats = ref({
  clinics: 0,
  users: 0,
  active: 0,
  activeUsers: 0
})

const activePercentage = computed(() => {
  if (stats.value.clinics === 0) return 0
  return Math.round((stats.value.active / stats.value.clinics) * 100)
})

// Simulate loading progress
const simulateLoading = async () => {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 90) progress = 90
      loadingProgress.value = Math.min(progress, 100)
      
      if (progress >= 90) {
        clearInterval(interval)
        resolve()
      }
    }, 300)
  })
}

onMounted(async () => {
  try {
    // Start loading simulation
    simulateLoading()
    
    // Update loading message
    loadingMessage.value = 'Loading clinics...'
    
    // Fetch data in parallel
    await Promise.all([
      clinicStore.refreshClinics(),
      userStore.refreshUsers()
    ])
    
    // Update progress to 100%
    loadingProgress.value = 100
    
    // Update stats
    stats.value = {
      clinics: clinicStore.totalClinics,
      users: userStore.totalUsers,
      active: clinicStore.activeClinics,
      activeUsers: userStore.activeUsers
    }
    
    // Show content for at least 2 seconds
    await new Promise(resolve => setTimeout(resolve, 1500))
    
  } catch (error) {
    console.error('Failed to load stats:', error)
    // Still show the app even if loading fails
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    // Complete loading
    loadingProgress.value = 100
    loadingMessage.value = 'Ready!'
    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false
  }
})
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

</style>