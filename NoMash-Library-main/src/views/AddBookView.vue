<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../Firebase/init.js'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const bookListVersion = ref(0)

const addBook = async () => {
  if (isSubmitting.value) return

  errorMessage.value = ''
  successMessage.value = ''

  const bookIsbn = Number(isbn.value)
  const bookName = name.value.trim()
  if (isbn.value === '' || !Number.isSafeInteger(bookIsbn) || bookIsbn <= 0 || !bookName) {
    errorMessage.value = 'Enter a positive whole number for ISBN and a book name.'
    return
  }

  if (!db) {
    errorMessage.value = 'Firebase is not configured. Please configure Firebase and restart the app.'
    return
  }

  isSubmitting.value = true
  try {
    const book = await addDoc(collection(db, 'books'), {
      isbn: bookIsbn,
      name: bookName
    })
    successMessage.value = `Book added successfully! Document ID: ${book.id}`
    isbn.value = ''
    name.value = ''
    bookListVersion.value += 1
  } catch (error) {
    console.error('Error adding book:', error.code)
    errorMessage.value =
      error.code === 'permission-denied'
        ? 'You do not have permission to add books. Check your sign-in and Firestore access rules.'
        : 'Unable to add the book. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="card add-book-card mx-auto shadow-sm">
      <div class="card-body p-4">
        <h1 class="h3 text-center mb-4">Add Book</h1>
        <form @submit.prevent="addBook" :aria-busy="isSubmitting">
          <div class="mb-3">
            <label for="book-isbn" class="form-label">ISBN</label>
            <input
              id="book-isbn"
              v-model.number="isbn"
              name="isbn"
              type="number"
              min="1"
              step="1"
              class="form-control"
              :disabled="isSubmitting"
              required
            />
          </div>
          <div class="mb-3">
            <label for="book-name" class="form-label">Book Name</label>
            <input
              id="book-name"
              v-model.trim="name"
              name="name"
              type="text"
              class="form-control"
              :disabled="isSubmitting"
              required
            />
          </div>
          <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
          <p v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</p>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? 'Adding book...' : 'Add Book' }}
          </button>
        </form>
      </div>
    </div>
    <BookList :key="bookListVersion" />
  </div>
</template>

<style scoped>
.add-book-card {
  max-width: 460px;
}
</style>
