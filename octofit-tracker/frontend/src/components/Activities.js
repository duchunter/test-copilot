import React, { useEffect, useMemo, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = `https://${codespaceName}-8000.app.github.dev/api/activities/`;

  const columns = useMemo(
    () => (activities[0] ? Object.keys(activities[0]) : []),
    [activities]
  );

  const fetchActivities = () => {
    setIsLoading(true);
    setError('');
    console.log('[Activities] Fetching from:', endpoint);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Activities] Data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
      })
      .catch((err) => {
        console.error('[Activities] Error:', err);
        setError('Unable to load activities.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchActivities();
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

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h2 className="h4 mb-1">Activities</h2>
              <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
                View API endpoint
              </a>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchActivities}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-sm-6 col-md-4">
              <label className="form-label" htmlFor="activities-filter">
                Filter activities
              </label>
              <input
                id="activities-filter"
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
          {!error && activities.length === 0 && !isLoading && (
            <div className="alert alert-info">No activities available.</div>
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
                {activities.map((activity, index) => (
                  <tr key={activity.id || activity._id || index}>
                    {columns.map((column) => (
                      <td key={`${column}-${index}`}>{formatValue(activity[column])}</td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(activity)}
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
                  <h5 className="modal-title">Activity Details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedActivity, null, 2)}</pre>
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

export default Activities;
