"use client";
import { useState, useEffect } from "react";
// Importujemy funkcje Firebase
import { db } from "./firebase"; 
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "firebase/firestore";

type FeedEntry = {
  id: string; // Firebase używa stringów jako ID
  timestamp: string;
};

export default function Home() {
  const [history, setHistory] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Podłączenie do bazy danych (nasłuchiwanie na żywo)
  useEffect(() => {
    // Zapytanie: weź kolekcję "feedings" i posortuj od najnowszych
    const q = query(collection(db, "feedings"), orderBy("timestamp", "desc"));

    // onSnapshot to magia - uruchamia się samo, gdy ktoś inny doda wpis!
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const feeds: FeedEntry[] = [];
      querySnapshot.forEach((doc) => {
        feeds.push({ 
            id: doc.id, 
            timestamp: doc.data().timestamp 
        });
      });
      setHistory(feeds);
      setLoading(false);
    });

    // Sprzątanie po wyjściu
    return () => unsubscribe();
  }, []);

  // Funkcja: Dodaj karmienie do chmury
  const handleFeed = async () => {
    try {
        await addDoc(collection(db, "feedings"), {
            timestamp: new Date().toISOString()
        });
        // Nie musimy robić setHistory - onSnapshot sam zaktualizuje listę!
    } catch (e) {
        console.error("Błąd dodawania: ", e);
        alert("Wystąpił błąd podczas zapisywania.");
    }
  };

  // Funkcja: Usuń wpis z chmury
  const handleDelete = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten wpis? Zniknie u wszystkich.")) {
        await deleteDoc(doc(db, "feedings", id));
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pl-PL", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "long",
    });
  };

  const lastFeed = history.length > 0 ? history[0] : null;

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      
      {/* Nagłówek */}
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">🐱 Koci Karmnik</h1>
        <p className="text-muted">Dane synchronizowane w chmurze ☁️</p>
      </div>

      {/* Karta Główna */}
      <div className="card shadow-sm border-0 mb-4 rounded-4">
        <div className="card-body text-center p-4">
          
          <h5 className="text-secondary text-uppercase fs-6 ls-2">Ostatnie karmienie</h5>
          
          {loading ? (
            <div className="spinner-border text-primary mb-4" role="status"></div>
          ) : lastFeed ? (
            <div className="display-6 fw-bold text-dark mb-4">
              {formatDate(lastFeed.timestamp)}
            </div>
          ) : (
            <div className="h4 text-muted mb-4 fst-italic">
              Jeszcze nie karmiono...
            </div>
          )}

          <button 
            onClick={handleFeed}
            disabled={loading}
            className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-lg"
            style={{ fontSize: "1.2rem" }}
          >
            🍖 NAKARM KOTA TERAZ
          </button>
        </div>
      </div>

      {/* Lista Historii */}
      <h3 className="h5 mb-3 ps-2 border-start border-4 border-primary">Historia posiłków</h3>
      
      <div className="list-group shadow-sm rounded-3 overflow-hidden">
        {!loading && history.length === 0 && (
          <div className="list-group-item text-center text-muted py-4">
            Brak historii.
          </div>
        )}

        {history.map((entry) => (
          <div 
            key={entry.id} 
            className="list-group-item d-flex justify-content-between align-items-center py-3"
          >
            <div>
              <span className="fw-medium">{formatDate(entry.timestamp)}</span>
            </div>
            <button 
              onClick={() => handleDelete(entry.id)}
              className="btn btn-outline-danger btn-sm rounded-circle"
              title="Usuń wpis"
              style={{ width: "32px", height: "32px", padding: 0, lineHeight: "30px" }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-5 text-muted small">
        <p>Aplikacja używa Google Firebase.</p>
      </div>
    </div>
  );
}