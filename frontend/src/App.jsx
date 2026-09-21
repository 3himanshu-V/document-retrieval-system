import { useEffect, useMemo, useRef, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
  keywordSearch,
  semanticSearch,
  hybridSearch,
  getSearchHistory,
  deleteSearchHistory
} from "./api";


/* =========================================================
   HELPERS
========================================================= */

function searchMethodName(method) {
  if (method === "semantic") {
    return "Search by meaning";
  }

  if (method === "keyword") {
    return "Exact words";
  }

  return "Best match";
}


function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


function formatDateTime(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {
  return (
    <aside className="simple-sidebar">

      <div className="simple-brand">
      <div className="simple-logo">D</div>

      <div>
        <strong>Document Retrieval</strong>
        <small>Document Retrieval System</small>
      </div>
    </div>


      <nav className="simple-nav">

        <NavLink
          to="/"
          end
        >
          Dashboard
        </NavLink>

        <NavLink to="/search">
          Search
        </NavLink>

        <NavLink to="/documents">
          Documents
        </NavLink>

        <NavLink to="/history">
          History
        </NavLink>

      </nav>

    </aside>
  );
}


/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  return (
    <div className="simple-layout">

      <Sidebar />

      <div className="simple-main">

        <header className="simple-topbar">
         <span>Document Retrieval System</span>
        </header>

        <main className="simple-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/search"
              element={<Search />}
            />

            <Route
              path="/documents"
              element={<Documents />}
            />

            <Route
              path="/history"
              element={<History />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  async function loadData() {

    setLoading(true);
    setError("");

    try {

      const [docs, searches] = await Promise.all([
        getDocuments(),
        getSearchHistory()
      ]);

      setDocuments(
        Array.isArray(docs)
          ? docs
          : []
      );

      setHistory(
        Array.isArray(searches)
          ? searches
          : []
      );

    } catch (err) {

      setError(
        err.message ||
        "Could not load dashboard."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadData();
  }, []);


  return (
    <div className="simple-page">

      <h1>Dashboard</h1>

      <p className="simple-description">
        Search and manage your documents.
      </p>


      {error && (
        <div className="simple-error">
          {error}
        </div>
      )}


      <section className="welcome-box">

        <h2>
          Welcome to Document Retrieval System
        </h2>

        <p>
          Upload documents and search their
          contents using different search methods.
        </p>

        <div className="simple-actions">

          <button
            onClick={() =>
              navigate("/search")
            }
          >
            Search documents
          </button>

          <button
            className="simple-secondary"
            onClick={() =>
              navigate("/documents")
            }
          >
            Upload document
          </button>

        </div>

      </section>


      <section className="simple-section">

        <div className="section-title">

          <h2>
            Overview
          </h2>

        </div>


        <div className="overview-list">

          <div>
            <span>Documents</span>
            <strong>
              {loading
                ? "..."
                : documents.length}
            </strong>
          </div>


          <div>
            <span>Searches</span>
            <strong>
              {loading
                ? "..."
                : history.length}
            </strong>
          </div>


        </div>

      </section>


      <section className="simple-section">

        <div className="section-title">

          <h2>
            Recent documents
          </h2>

          <button
            className="simple-link"
            onClick={() =>
              navigate("/documents")
            }
          >
            View all
          </button>

        </div>


        {documents.length === 0 ? (

          <p className="simple-muted">
            {loading
              ? "Loading..."
              : "No documents uploaded yet."}
          </p>

        ) : (

          <div className="simple-list">

            {documents
              .slice(0, 5)
              .map((document) => (

                <div
                  className="simple-list-row"
                  key={document.id}
                >

                  <div>

                    <strong>
                      {document.filename}
                    </strong>

                    <small>
                      {document.file_type.toUpperCase()}
                      {" · "}
                      {document.chunks} parts
                    </small>

                  </div>


                  <span>
                    {formatDate(
                      document.uploaded_at
                    )}
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>


      <section className="simple-section">

        <div className="section-title">

          <h2>
            Recent searches
          </h2>

          <button
            className="simple-link"
            onClick={() =>
              navigate("/history")
            }
          >
            View all
          </button>

        </div>


        {history.length === 0 ? (

          <p className="simple-muted">
            {loading
              ? "Loading..."
              : "No searches yet."}
          </p>

        ) : (

          <div className="simple-list">

            {history
              .slice(0, 5)
              .map((item) => (

                <div
                  className="simple-list-row"
                  key={item.id}
                >

                  <div>

                    <strong>
                      {item.query}
                    </strong>

                    <small>
                      {searchMethodName(
                        item.method
                      )}
                    </small>

                  </div>


                  <span>
                    {formatDate(
                      item.created_at
                    )}
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>

    </div>
  );
}


/* =========================================================
   SEARCH PAGE
========================================================= */

function Search() {

  const [params] = useSearchParams();

  const [query, setQuery] = useState(
    params.get("q") || ""
  );

  const [topK, setTopK] = useState(5);

  const [results, setResults] = useState([]);

  const [searched, setSearched] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [document, setDocument] = useState(null);

  const [documentLoading, setDocumentLoading] =
    useState(false);


  async function performSearch(event) {

    event.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setError("Please enter something to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const data = {
        query: cleanQuery,
        top_k: Number(topK)
      };

      const response =
       await hybridSearch(data);

      setResults(
        Array.isArray(response?.results)
          ? response.results
          : []
      );

      setSearched(true);

    } catch (err) {

      setError(
        err.message ||
        "Search failed."
      );

      setResults([]);

    } finally {

      setLoading(false);

    }
  }


  async function openDocument(id) {

    setDocumentLoading(true);
    setError("");

    try {

      const data =
        await getDocument(id);

      setDocument(data);

    } catch (err) {

      setError(
        err.message ||
        "Could not open document."
      );

    } finally {

      setDocumentLoading(false);

    }
  }


  return (
    <div className="simple-page">

      <h1>
        Search Documents
      </h1>

      <p className="simple-description">
        Search through the documents in your library.
      </p>


      <form
        className="simple-search-box"
        onSubmit={performSearch}
      >

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="What are you looking for?"
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>

      </form>


      {error && (
        <div className="simple-error">
          {error}
        </div>
      )}


      {searched && (

        <section className="simple-section">

          <div className="section-title">

            <h2>
              Results
            </h2>

            <span className="simple-muted">
              {results.length} result
              {results.length === 1
                ? ""
                : "s"}
            </span>

          </div>


          {results.length === 0 ? (

            <p className="simple-muted">
              No matching results were found.
            </p>

          ) : (

            <div className="search-results">

              {results.map((result) => (

                <article
                  className="search-result"
                  key={result.id}
                >

                  <div className="result-header">

                    <strong>
                      {result.filename}
                    </strong>

                    <span>
                      {result.file_type}
                    </span>

                  </div>


                  <small>
                    Part {result.chunk_index + 1}
                    {" · "}
                    Relevance {Math.round(result.score)}%
                  </small>


                  <p>
                    {result.text}
                  </p>


                  <button
                    className="simple-link"
                    disabled={documentLoading}
                    onClick={() =>
                      openDocument(
                        result.document_id
                      )
                    }
                  >
                    {documentLoading
                      ? "Opening..."
                      : "Open document"}
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

      )}


      {document && (
        <DocumentViewer
          document={document}
          close={() =>
            setDocument(null)
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   DOCUMENT VIEWER
========================================================= */

function DocumentViewer({
  document,
  close
}) {

  return (
    <div
      className="simple-overlay"
      onClick={close}
    >

      <div
        className="simple-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="modal-header">

          <div>

            <h2>
              {document.filename}
            </h2>

            <small>
              {document.file_type.toUpperCase()}
              {" · "}
              {document.chunks} parts
            </small>

          </div>


          <button
            onClick={close}
          >
            Close
          </button>

        </div>


        <div className="document-content">
          {document.content}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   DOCUMENTS PAGE
========================================================= */

function Documents() {

  const [documents, setDocuments] =
    useState([]);

  const [filter, setFilter] =
    useState("");

  const [type, setType] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [viewer, setViewer] =
    useState(null);

  const [viewerLoading, setViewerLoading] =
    useState(false);

  const fileInput =
    useRef(null);


  async function loadDocuments() {

    setLoading(true);
    setError("");

    try {

      const data =
        await getDocuments();

      setDocuments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      setError(
        err.message ||
        "Could not load documents."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadDocuments();
  }, []);


  async function handleUpload(event) {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {

      await uploadDocument(file);

      setMessage(
        "Document uploaded successfully."
      );

      await loadDocuments();

    } catch (err) {

      setError(
        err.message ||
        "Upload failed."
      );

    } finally {

      setUploading(false);

      event.target.value = "";

    }
  }


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }

    setDeleting(id);
    setError("");
    setMessage("");

    try {

      await deleteDocument(id);

      setMessage(
        "Document deleted successfully."
      );

      await loadDocuments();

    } catch (err) {

      setError(
        err.message ||
        "Could not delete document."
      );

    } finally {

      setDeleting(null);

    }
  }


  async function openDocument(id) {

    setViewerLoading(true);
    setError("");

    try {

      const data =
        await getDocument(id);

      setViewer(data);

    } catch (err) {

      setError(
        err.message ||
        "Could not open document."
      );

    } finally {

      setViewerLoading(false);

    }
  }


  const filteredDocuments =
    useMemo(() => {

      return [...documents]
        .filter((document) =>
          document.filename
            .toLowerCase()
            .includes(
              filter.toLowerCase()
            )
        )
        .filter(
          (document) =>
            type === "all" ||
            document.file_type === type
        )
        .sort((a, b) => {

          const first =
            new Date(
              a.uploaded_at
            ).getTime();

          const second =
            new Date(
              b.uploaded_at
            ).getTime();

          return sort === "oldest"
            ? first - second
            : second - first;

        });

    }, [
      documents,
      filter,
      type,
      sort
    ]);


  return (
    <div className="simple-page">

      <div className="simple-page-header">

        <div>

          <h1>
            Documents
          </h1>

          <p className="simple-description">
            Manage the documents available for search.
          </p>

        </div>


        <button
          onClick={() =>
            fileInput.current?.click()
          }
          disabled={uploading}
        >
          {uploading
            ? "Uploading..."
            : "Upload document"}
        </button>


        <input
          ref={fileInput}
          type="file"
          hidden
          accept=".txt,.pdf,.docx"
          onChange={handleUpload}
        />

      </div>


      {message && (
        <div className="simple-success">
          {message}
        </div>
      )}


      {error && (
        <div className="simple-error">
          {error}
        </div>
      )}


      <section className="document-controls">

        <input
          type="text"
          placeholder="Search documents..."
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        />


        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
        >

          <option value="all">
            All types
          </option>

          <option value="txt">
            TXT
          </option>

          <option value="pdf">
            PDF
          </option>

          <option value="docx">
            DOCX
          </option>

        </select>


        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >

          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

        </select>


        <button
          className="simple-secondary"
          onClick={loadDocuments}
        >
          Refresh
        </button>

      </section>


      <p className="simple-muted">
        {loading
          ? "Loading documents..."
          : `${filteredDocuments.length} document${
              filteredDocuments.length === 1
                ? ""
                : "s"
            }`}
      </p>


      <section className="simple-table">

        <div className="simple-table-head">

          <span>
            Name
          </span>

          <span>
            Type
          </span>

          <span>
            Parts
          </span>

          <span>
            Uploaded
          </span>

          <span>
            Actions
          </span>

        </div>


        {!loading &&
          filteredDocuments.length === 0 && (

            <div className="simple-empty">

              <h3>
                No documents found
              </h3>

              <p>
                Upload a document to start searching.
              </p>

            </div>

          )}


        {filteredDocuments.map((document) => (

          <div
            className="simple-table-row"
            key={document.id}
          >

            <strong>
              {document.filename}
            </strong>


            <span>
              {document.file_type.toUpperCase()}
            </span>


            <span>
              {document.chunks}
            </span>


            <span>
              {formatDate(
                document.uploaded_at
              )}
            </span>


            <div className="table-actions">

              <button
                className="simple-link"
                disabled={viewerLoading}
                onClick={() =>
                  openDocument(
                    document.id
                  )
                }
              >
                {viewerLoading
                  ? "Opening..."
                  : "Open"}
              </button>


              <button
                className="delete-button"
                disabled={
                  deleting === document.id
                }
                onClick={() =>
                  handleDelete(
                    document.id
                  )
                }
              >
                {deleting === document.id
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        ))}

      </section>


      {viewer && (
        <DocumentViewer
          document={viewer}
          close={() =>
            setViewer(null)
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   HISTORY
========================================================= */

function History() {

  const navigate = useNavigate();

  const [history, setHistory] =
    useState([]);

  const [filter, setFilter] =
    useState("");


  const [sort, setSort] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function loadHistory() {

    setLoading(true);
    setError("");

    try {

      const data =
        await getSearchHistory();

      setHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      setError(
        err.message ||
        "Could not load search history."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadHistory();
  }, []);


  async function clearHistory() {

    if (!history.length) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all search history?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteSearchHistory();

      setHistory([]);

    } catch (err) {

      setError(
        err.message ||
        "Could not clear history."
      );

    }
  }


  function rerunSearch(item) {

    navigate(
      `/search?q=${encodeURIComponent(
        item.query
      )}`
    );
  }


  const filteredHistory =
    useMemo(() => {

      return [...history]
        .filter((item) =>
          item.query
            .toLowerCase()
            .includes(
              filter.toLowerCase()
            )
        )
        .sort((a, b) => {

          const first =
            new Date(
              a.created_at
            ).getTime();

          const second =
            new Date(
              b.created_at
            ).getTime();

          return sort === "oldest"
            ? first - second
            : second - first;

        });

    }, [
      history,
      filter,
      method,
      sort
    ]);


  return (
    <div className="simple-page">

      <div className="simple-page-header">

        <div>

          <h1>
            Search History
          </h1>

          <p className="simple-description">
            View your previous searches.
          </p>

        </div>


        <button
          className="simple-secondary"
          disabled={!history.length}
          onClick={clearHistory}
        >
          Clear history
        </button>

      </div>


      {error && (
        <div className="simple-error">
          {error}
        </div>
      )}


      <section className="document-controls">

        <input
          type="text"
          placeholder="Search history..."
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        />


        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >

          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

        </select>


        <button
          className="simple-secondary"
          onClick={loadHistory}
        >
          Refresh
        </button>

      </section>


      <section className="simple-table">

        <div className="history-table-head">

          <span>
            Query
          </span>

          <span>
            Results
          </span>

          <span>
            Date
          </span>

          <span>
            Action
          </span>

        </div>


        {!loading &&
          filteredHistory.length === 0 && (

            <div className="simple-empty">

              <h3>
                No searches found
              </h3>

              <p>
                Your previous searches will appear here.
              </p>


              <button
                onClick={() =>
                  navigate("/search")
                }
              >
                Start searching
              </button>

            </div>

          )}


        {filteredHistory.map((item) => (

          <div
            className="history-table-row"
            key={item.id}
          >

            <strong>
              {item.query}
            </strong>


            <span>
              {item.top_k}
            </span>


            <span>
              {formatDateTime(
                item.created_at
              )}
            </span>


            <button
              className="simple-link"
              onClick={() =>
                rerunSearch(item)
              }
            >
              Rerun
            </button>

          </div>

        ))}

      </section>

    </div>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  return <Layout />;
}


export default App;