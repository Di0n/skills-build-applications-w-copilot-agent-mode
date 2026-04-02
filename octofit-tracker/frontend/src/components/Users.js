import { useCallback, useEffect, useState } from 'react';

function Users() {
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError('');
    console.log('Users endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users fetched data:', data);
        const parsed = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setUsers(parsed);
      })
      .catch((fetchError) => {
        console.error('Users fetch error:', fetchError);
        setError('Kon gebruikers niet laden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredItems = users.filter((item) => {
    const primaryText = `${item.username ?? item.name ?? ''}`.toLowerCase();
    return primaryText.includes(query.toLowerCase());
  });

  const openDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <section className="container py-4">
      <div className="card page-card">
        <div className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <h2 className="h3 mb-0">Users</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="button" onClick={fetchUsers}>
              {loading ? 'Laden...' : 'Vernieuwen'}
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              disabled={!filteredItems.length}
              onClick={() => openDetails(filteredItems[0])}
            >
              Eerste rij details
            </button>
          </div>
        </div>
        <div className="card-body">
          <p className="mb-3">
            <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">Users API endpoint</a>
          </p>

          <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-md-8">
              <label htmlFor="usersSearch" className="form-label">Zoeken</label>
              <input
                id="usersSearch"
                className="form-control"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter op gebruikersnaam"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Aantal resultaten</label>
              <input className="form-control" value={filteredItems.length} readOnly />
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Primary</th>
                  <th scope="col">Secondary</th>
                  <th scope="col">Raw preview</th>
                  <th scope="col">Actie</th>
                </tr>
              </thead>
              <tbody>
                {!filteredItems.length && (
                  <tr>
                    <td colSpan="5" className="text-center text-secondary">Geen gebruikers gevonden.</td>
                  </tr>
                )}
                {filteredItems.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.username ?? item.name ?? `User ${index + 1}`}</td>
                    <td>{item.email ?? item.role ?? '-'}</td>
                    <td><span className="json-preview">{JSON.stringify(item)}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => openDetails(item)}>
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
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedItem, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Sluiten</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
        </>
      )}
    </section>
  );
}

export default Users;
