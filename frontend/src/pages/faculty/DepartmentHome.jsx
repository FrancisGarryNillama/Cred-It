import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, SidebarFaculty } from '../../components/layout';
import {
  Button,
  TabNavigation,
  DataTable,
  AdvancedSearchBar,
  StatusBadge,
  Loader,
} from '../../components/common';
import { requestApi } from '../../api';
import { useNotification, useDebounce } from '../../hooks';
import { formatDate } from '../../utils';

export default function DepartmentHome() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(false);

  // Data states
  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { showError } = useNotification();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [requestsData, applicationsData, acceptedData] = await Promise.all([
        requestApi.getRequestTorList(),
        requestApi.getPendingRequests(),
        requestApi.getFinalDocuments(),
      ]);

      setRequests(requestsData);
      setApplications(applicationsData);
      setAcceptedList(acceptedData);
    } catch (error) {
      showError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data, idField) => {
    if (!debouncedSearch.trim()) return data;

    return data.filter((item) => {
      const query = debouncedSearch.toLowerCase();

      switch (searchFilter) {
        case 'name':
          return item.applicant_name?.toLowerCase().includes(query);
        case 'id':
          return item[idField]?.toString().toLowerCase().includes(query);
        case 'all':
        default:
          return (
            item.applicant_name?.toLowerCase().includes(query) ||
            item[idField]?.toString().toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query)
          );
      }
    });
  };

  const filteredRequests = filterData(requests, 'accountID');
  const filteredApplications = filterData(applications, 'applicant_id');
  const filteredAccepted = filterData(acceptedList, 'accountID');

  const tabs = [
    { id: 'requests', label: 'Requests', count: filteredRequests.length },
    { id: 'applications', label: 'Applications', count: filteredApplications.length },
    { id: 'accepted', label: 'Accepted', count: filteredAccepted.length },
  ];

  const requestColumns = [
    { header: 'REQUEST ID', accessor: 'accountID' },
    { header: "APPLICANT'S NAME", accessor: 'applicant_name' },
    { 
      header: 'STATUS', 
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'REQUEST DATE', 
      render: (row) => formatDate(row.request_date)
    },
    {
      header: 'ACTIONS',
      render: (row) => (
        <Button
          size="sm"
          onClick={() => navigate(`/request/${row.accountID}`)}
        >
          OPEN REQUEST
        </Button>
      ),
    },
  ];

  const applicationColumns = [
    { header: 'APPLICATION ID', accessor: 'applicant_id' },
    { header: "APPLICANT'S NAME", accessor: 'applicant_name' },
    { 
      header: 'STATUS', 
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'REQUEST DATE', 
      render: (row) => formatDate(row.request_date)
    },
    {
      header: 'ACTIONS',
      render: (row) => (
        <Button
          size="sm"
          onClick={() => navigate(`/document/${row.applicant_id}`)}
        >
          VIEW/EDIT DOCUMENT
        </Button>
      ),
    },
  ];

  const acceptedColumns = [
    { header: 'ACCOUNT ID', accessor: 'accountID' },
    { header: "APPLICANT'S NAME", accessor: 'applicant_name' },
    { 
      header: 'STATUS', 
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'REQUEST DATE', 
      render: (row) => formatDate(row.request_date)
    },
    { 
      header: 'ACCEPTED DATE', 
      render: (row) => formatDate(row.accepted_date)
    },
    {
      header: 'ACTIONS',
      render: (row) => (
        <Button
          size="sm"
          onClick={() => navigate(`/finalDocument/${row.accountID}`)}
        >
          VIEW
        </Button>
      ),
    },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'name', label: 'Applicant Name' },
    { value: 'id', label: 'ID' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={userName} />
      <SidebarFaculty sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="p-6 mt-4 space-y-8">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <AdvancedSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={{ field: searchFilter }}
          onFilterChange={(f) => setSearchFilter(f.field)}
          filterOptions={filterOptions}
          onClear={() => {
            setSearchQuery('');
            setSearchFilter('all');
          }}
        />

        {activeTab === 'requests' && (
          <DataTable
            columns={requestColumns}
            data={filteredRequests}
            loading={loading}
            emptyMessage={
              searchQuery ? 'No matching requests found.' : 'No requests found.'
            }
          />
        )}

        {activeTab === 'applications' && (
          <DataTable
            columns={applicationColumns}
            data={filteredApplications}
            loading={loading}
            emptyMessage={
              searchQuery ? 'No matching applications found.' : 'No applications found.'
            }
          />
        )}

        {activeTab === 'accepted' && (
          <DataTable
            columns={acceptedColumns}
            data={filteredAccepted}
            loading={loading}
            emptyMessage={
              searchQuery ? 'No matching accepted entries found.' : 'No accepted entries found.'
            }
          />
        )}
      </main>
    </div>
  );
}