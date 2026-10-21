<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import db from '../Firebase/init.js'

const books = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const statusMessage = ref('')
const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')
const isSaving = ref(false)
const pendingDelete = ref(null)

const startEdit = (book) => {
  editingId.value = book.id
  editIsbn.value = book.isbn
  editName.value = book.name
  statusMessage.value = ''
}

const saveBook = async () => {
  if (isSaving.value) return
  const isbn = Number(editIsbn.value)
  const name = editName.value.trim()
  if (!Number.isSafeInteger(isbn) || isbn <= 0 || !name) {
    statusMessage.value = 'Enter a positive whole ISBN and a book name.'
    return
  }
  isSaving.value = true
  try {
    await updateDoc(doc(db, 'books', editingId.value), { isbn, name })
    editingId.value = null
    statusMessage.value = `Updated: ${name} (ISBN: ${isbn}).`
    await fetchBooks()
  } catch (error) {
    statusMessage.value = `Update failed: ${error.code}.`
  } finally {
    isSaving.value = false
  }
}

const removeBook = async (book) => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await deleteDoc(doc(db, 'books', book.id))
    pendingDelete.value = null
    if (editingId.value === book.id) editingId.value = null
    statusMessage.value = `Deleted: ${book.name} (ISBN: ${book.isbn}).`
    await fetchBooks()
  } catch (error) {
    statusMessage.value = `Delete failed: ${error.code}.`
  } finally {
    isSaving.value = false
  }
}

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    if (!db) {
      errorMessage.value =
        'Firebase is not configured. Please configure Firebase and restart the app.'
      return
    }

    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(5)
    )
    const snapshot = await getDocs(booksQuery)
    books.value = snapshot.docs.map((document) => ({
      id: document.id,
      isbn: document.data().isbn,
      name: document.data().name
    }))
  } catch (error) {
    console.error('Error fetching books:', error.code)
    errorMessage.value =
      error.code === 'permission-denied'
        ? 'You do not have permission to view books. Check your sign-in and Firestore access rules.'
        : 'Unable to load books. Please check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBooks)
</script>

<template>
  <section class="card book-list mx-auto mt-4 mb-5 shadow-sm" :aria-busy="isLoading">
    <div class="card-body p-4">
      <h2 class="h4 mb-3">Books with ISBN greater than 1000</h2>
      <p class="text-muted">ISBN &gt; 1000 · ISBN ascending · First 5 books</p>
      <p v-if="statusMessage" class="alert alert-info" role="status">{{ statusMessage }}</p>
      <div v-if="pendingDelete" class="alert alert-warning" role="alert">
        <p>Delete "{{ pendingDelete.name }}" permanently?</p>
        <button
          type="button"
          class="btn btn-danger me-2"
          :disabled="isSaving"
          @click="removeBook(pendingDelete)"
        >
          Confirm delete
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="isSaving"
          @click="pendingDelete = null"
        >
          Cancel
        </button>
      </div>
      <form v-if="editingId" class="border rounded p-3 mb-3" @submit.prevent="saveBook">
        <h3 class="h5">Edit book</h3>
        <label for="edit-isbn" class="form-label">ISBN</label>
        <input
          id="edit-isbn"
          v-model.number="editIsbn"
          type="number"
          min="1"
          step="1"
          required
          class="form-control mb-2"
          :disabled="isSaving"
        />
        <label for="edit-name" class="form-label">Book Name</label>
        <input
          id="edit-name"
          v-model.trim="editName"
          required
          class="form-control mb-3"
          :disabled="isSaving"
        />
        <button class="btn btn-primary me-2" :disabled="isSaving">Save changes</button>
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="isSaving"
          @click="editingId = null"
        >
          Cancel
        </button>
      </form>
      <p v-if="isLoading" role="status">Loading books...</p>
      <div v-else-if="errorMessage">
        <p class="alert alert-danger" role="alert">{{ errorMessage }}</p>
        <button type="button" class="btn btn-outline-primary" @click="fetchBooks">Try again</button>
      </div>
      <p v-else-if="books.length === 0" class="text-muted mb-0" role="status">
        No books with ISBN greater than 1000 were found.
      </p>
      <ul v-else class="list-group">
        <li v-for="book in books" :key="book.id" class="list-group-item">
          <strong>{{ book.name }}</strong>
          <div class="text-muted">ISBN: {{ book.isbn }}</div>
          <div class="mt-2 d-flex gap-2">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              :disabled="isSaving"
              @click="startEdit(book)"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              :disabled="isSaving"
              @click="pendingDelete = book"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.book-list {
  max-width: 460px;
}
</style>
