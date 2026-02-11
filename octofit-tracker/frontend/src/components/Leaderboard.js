import React, { useEffect, useMemo, useState } from 'react';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;

  const columns = useMemo(
    () => (entries[0] ? Object.keys(entries[0]) : []),
    [entries]
  );

  const fetchLeaderboard = () => {
    setIsLoading(true);
    setError('');
    console.log('[Leaderboard] Fetching from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Leaderboard] Data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
      })
      .catch((err) => {
        console.error('[Leaderboard] Error:', err);
        setError('Unable to load leaderboard.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h2 className="h4 mb-1">Leaderboard</h2>
              <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
                View API endpoint
              </a>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchLeaderboard}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-sm-6 col-md-4">
              <label className="form-label" htmlFor="leaderboard-filter">
                Filter entries
              </label>
              <input
                id="leaderboard-filter"
                className="form-control"
                type="text"
                placeholder="Search by keyword"
                value={filterText}
                onChange={(event) => setFilterText(event.target.value)}
              />
            </div>
            <div className="col-auto mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setFilterText('')}>
                Clear
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}
          {!error && entries.length === 0 && !isLoading && (
            <div className="alert alert-info">No leaderboard entries available.</div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {columns.map((column) => (
                    <th scope="col" key={column}>
                      {column}
                    </th>
                  ))}
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id || entry._id || index}>
                    {columns.map((column) => (
                      <td key={`${column}-${index}`}>{formatValue(entry[column])}</td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(entry)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard Entry</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedEntry, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default Leaderboard;
