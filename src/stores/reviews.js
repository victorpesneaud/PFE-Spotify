import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchReviews = async (albumId) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`http://localhost:3000/api/reviews/${albumId}`)
      if (!response.ok) throw new Error('Failed to fetch reviews')
      reviews.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching reviews:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addReview = async (albumId, review) => {
    isLoading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          albumId,
          ...review
        })
      })
      if (!response.ok) throw new Error('Failed to add review')
      const newReview = await response.json()
      reviews.value.unshift(newReview)
    } catch (err) {
      error.value = err.message
      console.error('Error adding review:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    addReview
  }
}) 