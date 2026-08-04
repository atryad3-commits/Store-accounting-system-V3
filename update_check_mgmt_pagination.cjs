const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(
  "const filters = useCheckFilters(issuedChecks, receivedChecks, persons, accounts, checkbooks);",
  `const [issuedPage, setIssuedPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
  const pageSize = 20;

  const filters = useCheckFilters(issuedChecks, receivedChecks, persons, accounts, checkbooks);

  const { data: paginatedIssued } = useQuery({
    queryKey: ['issued_checks', issuedPage, pageSize, filters.issuedSortBy, filters.issuedSortDir],
    queryFn: async () => {
       const qs = new URLSearchParams({ page: issuedPage, pageSize, sortBy: filters.issuedSortBy, sortDir: filters.issuedSortDir }).toString();
       const res = await fetch('/api/data/issued_checks?' + qs, {
          headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''), 'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
       });
       if (!res.ok) throw new Error('Error fetching issued checks');
       return res.json();
    },
  });

  const { data: paginatedReceived } = useQuery({
    queryKey: ['received_checks', receivedPage, pageSize, filters.receivedSortBy, filters.receivedSortDir],
    queryFn: async () => {
       const qs = new URLSearchParams({ page: receivedPage, pageSize, sortBy: filters.receivedSortBy, sortDir: filters.receivedSortDir }).toString();
       const res = await fetch('/api/data/received_checks?' + qs, {
          headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''), 'x-store-id': localStorage.getItem('activeStoreId') || 'default' }
       });
       if (!res.ok) throw new Error('Error fetching received checks');
       return res.json();
    },
  });

  const displayIssuedChecks = paginatedIssued?.data || filters.filteredIssuedChecks;
  const displayReceivedChecks = paginatedReceived?.data || filters.filteredReceivedChecks;
`
);

// We need to pass displayIssuedChecks to IssuedChecksList
file = file.replace(
  /filteredIssuedChecks={filters\.filteredIssuedChecks}/,
  `filteredIssuedChecks={displayIssuedChecks} issuedPage={issuedPage} setIssuedPage={setIssuedPage} totalIssuedPages={paginatedIssued?.totalCount ? Math.ceil(paginatedIssued.totalCount / pageSize) : 1}`
);

file = file.replace(
  /filteredReceivedChecks={filters\.filteredReceivedChecks}/,
  `filteredReceivedChecks={displayReceivedChecks} receivedPage={receivedPage} setReceivedPage={setReceivedPage} totalReceivedPages={paginatedReceived?.totalCount ? Math.ceil(paginatedReceived.totalCount / pageSize) : 1}`
);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);
