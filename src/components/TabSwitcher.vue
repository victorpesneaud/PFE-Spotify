<template>
  <div class="tab-switcher">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="selectTab(tab.id)"
      :class="['tab-btn', { active: selectedTab === tab.id }]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  initialTab: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['tab-change'])

const selectedTab = ref(props.initialTab || props.tabs[0]?.id)

const selectTab = (tabId) => {
  selectedTab.value = tabId
  emit('tab-change', tabId)
}
</script>

<style scoped>
.tab-switcher {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn:hover {
  color: white;
}

.tab-btn.active {
  color: white;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1db954;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .tab-switcher {
    gap: 0.5rem;
  }
  
  .tab-btn {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
</style> 