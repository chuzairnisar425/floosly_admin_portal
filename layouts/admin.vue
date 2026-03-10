<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile menu overlay -->
    <div v-if="mobileMenuOpen" 
         class="fixed inset-0 z-40 md:hidden"
         @click="mobileMenuOpen = false">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>
    </div>

    <!-- Admin Sidebar/Header -->
    <div class="flex">
      <!-- Sidebar -->
      <aside :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm flex-col border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
        <div class="px-6 py-6">
          <h1 class="text-2xl font-bold text-primary-600">Flossly</h1>
          <p class="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        
        <nav class="flex-1 px-6 space-y-1">
          <NuxtLink
            to="/admin"
            class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
              </svg>
              Dashboard
            </div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/clinics"
            class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Clinics
            </div>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/users"
            class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              Users
            </div>
          </NuxtLink>
        </nav>
        
        <div class="px-6 py-4 border-t border-gray-200">
          <button class="w-full flex items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 min-h-screen bg-gray-50">
        <!-- Top Bar -->
        <div class="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-4">
          <div class="flex justify-between items-center">
            <!-- Mobile menu button -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <h2 class="text-lg font-semibold text-gray-900 md:block hidden">Admin Portal</h2>
            
            <div class="text-sm text-gray-500">
              {{ new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </div>
          </div>
        </div>
        
        <!-- Page Content -->
        <div class="px-4 md:px-8 py-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>
