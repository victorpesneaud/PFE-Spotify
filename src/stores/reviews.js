import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchReviews = async (albumId) => {
    reviews.value = []
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/album/${albumId}`)
      if (!response.ok) throw new Error('Failed to fetch reviews')
  
      const data = await response.json()
  
      // ✅ This fixes it:
      reviews.value = data.reviews
  
      console.log('reviews:', reviews.value)
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
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          albumId,
          ...review
        })
      })
      if (!response.ok) throw new Error('Failed to add review')
      const newReview = await response.json()
      console.log('newReview', newReview)
      reviews.value.unshift(newReview)
    } catch (err) {
      error.value = err.message
      console.error('Error adding review:', err)
    } finally {
      isLoading.value = false
    }
  }

  const deleteReview = async (reviewId) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE', 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete review')
      reviews.value = reviews.value.filter(review => review._id !== reviewId)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting review:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    addReview,
    deleteReview
  }
}) 