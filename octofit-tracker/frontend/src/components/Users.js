import React, { useEffect, useMemo, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/users/`;

  const columns = useMemo(
    () => (users[0] ? Object.keys(users[0]) : []),
    [users]
  );

  const fetchUsers = () => {
    setIsLoading(true);
    setError('');
    console.log('[Users] Fetching from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Users] Data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
      })
      .catch((err) => {
        console.error('[Users] Error:', err);
        setError('Unable to load users.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
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

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h2 className="h4 mb-1">Users</h2>
              <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
                View API endpoint
              </a>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-sm-6 col-md-4">
              <label className="form-label" htmlFor="users-filter">
                Filter users
              </label>
              <input
                id="users-filter"
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
          {!error && users.length === 0 && !isLoading && (
            <div className="alert alert-info">No users available.</div>
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
                {users.map((user, index) => (
                  <tr key={user.id || user._id || index}>
                    {columns.map((column) => (
                      <td key={`${column}-${index}`}>{formatValue(user[column])}</td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(user)}
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
                  <h5 className="modal-title">User Details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedUser, null, 2)}</pre>
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

export default Users;
