import { useState } from "react";
import styles from "../styles/styles";

export default function BookCard({ book, checkoutBook, returnBook }) {
  const [patronName, setPatronName] = useState("");

  function handleCheckout() {
    checkoutBook(book.id, patronName);
    setPatronName("");
  }

  return (
    <div style={styles.card}>
      <h3>{book.title}</h3>
      <p>by {book.author}</p>

      <p style={{ color: book.available ? "green" : "red", fontWeight: "bold" }}>
        {book.available ? "Available" : "Checked Out"}
      </p>

      {!book.available && (
        <>
          <p>Patron: {book.patron}</p>
          <p>Due: {book.dueDate}</p>
        </>
      )}

      {book.available ? (
        <>
          <input
            type="text"
            placeholder="Enter patron name"
            value={patronName}
            onChange={(e) => setPatronName(e.target.value)}
            style={styles.textInput}
          />
          <button onClick={handleCheckout} style={styles.checkoutButton}>
            Checkout
          </button>
        </>
      ) : (
        <button onClick={() => returnBook(book.id)} style={styles.returnButton}>
          Return
        </button>
      )}
    </div>
  );
}