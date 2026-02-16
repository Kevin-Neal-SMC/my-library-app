import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import bookShelf from "./bookShelf";
import styles from "./styles";

export default function App() {
  const savedBooks = JSON.parse(localStorage.getItem("books"));
  const savedQuery = localStorage.getItem("query");
  const savedAvailable = JSON.parse(localStorage.getItem("showAvailableOnly"));
  const savedCheckedOut = JSON.parse(localStorage.getItem("showCheckedOutOnly"));

  const [books, setBooks] = useState(savedBooks || bookShelf);
  const [query, setQuery] = useState(savedQuery || "");
  const [showAvailableOnly, setShowAvailableOnly] = useState(savedAvailable || false);
  const [showCheckedOutOnly, setShowCheckedOutOnly] = useState(savedCheckedOut || false);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("query", query);
    localStorage.setItem("showAvailableOnly", JSON.stringify(showAvailableOnly));
    localStorage.setItem("showCheckedOutOnly", JSON.stringify(showCheckedOutOnly));
  }, [books, query, showAvailableOnly, showCheckedOutOnly]);

  function getDueDate() {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  }

  let visibleBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  if (showAvailableOnly) visibleBooks = visibleBooks.filter(book => book.available);
  if (showCheckedOutOnly) visibleBooks = visibleBooks.filter(book => !book.available);

  function checkoutBook(id, patronName) {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, available: false, patron: patronName, dueDate: getDueDate() }
          : book
      )
    );
  }

  function returnBook(id) {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, available: true, patron: "", dueDate: "" }
          : book
      )
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📚 Library Search</h1>

      <input
        type="text"
        placeholder="Search for a book..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />

      <div style={styles.filterRow}>
        <button
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          style={styles.filterButton}
        >
          {showAvailableOnly ? "Show All Books" : "Show Available Books"}
        </button>

        <button
          onClick={() => setShowCheckedOutOnly(!showCheckedOutOnly)}
          style={styles.filterButton}
        >
          {showCheckedOutOnly ? "Show All Books" : "Show Checked-Out Books"}
        </button>
      </div>

      <div style={styles.list}>
        {visibleBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            checkoutBook={checkoutBook}
            returnBook={returnBook}
          />
        ))}
      </div>
    </div>
  );
}