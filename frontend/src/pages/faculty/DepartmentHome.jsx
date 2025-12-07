import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, SidebarFaculty } from '../../components/layout';
import {
  Button,
  DataTable,
  AdvancedSearchBar,
  StatusBadge,
} from '../../components/common';
import { requestApi } from '../../api';
import { useNotification, useDebounce } from '../../hooks';
import { formatDate } from '../../utils';
import { useAuthContext } from '../../context';
import { FileText, Users, CheckCircle } from 'lucide-react';

export default function DepartmentHome() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(false);

  // Get user from auth context instead of localStorage
  const { user } = useAuthContext();
  const userName = user?.username || '';

  // Data states
  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { showError } = useNotification();

  const fetchAllData = useCallback(async () => {
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
  }, [showError]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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

  // Stats cards data - now clickable
  const stats = [
    {
      id: 'requests',
      title: 'Pending Requests',
      count: filteredRequests.length,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      activeBorder: 'border-blue-500',
    },
    {
      id: 'applications',
      title: 'In Progress',
      count: filteredApplications.length,
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      activeBorder: 'border-indigo-500',
    },
    {
      id: 'accepted',
      title: 'Completed',
      count: filteredAccepted.length,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      activeBorder: 'border-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} userName={userName} />
      <SidebarFaculty sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed top-[80px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section - Clean and Simple */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Department Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage student accreditation requests and applications
          </p>
        </div>

        {/* Clickable Stats Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isActive = activeTab === stat.id;
            return (
              <button
                key={stat.id}
                onClick={() => setActiveTab(stat.id)}
                className={`${stat.bgColor} rounded-xl border-2 ${isActive ? `${stat.activeBorder} shadow-lg` : stat.borderColor
                  } p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 text-left w-full ${isActive ? 'ring-4 ring-opacity-20' : ''
                  }`}
                style={isActive ? { ringColor: stat.iconColor } : {}}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 sm:p-3 ${stat.bgColor} rounded-lg border ${isActive ? stat.activeBorder : stat.borderColor}`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} />
                  </div>
                  {isActive && (
                    <div className={`px-2.5 py-1 ${stat.bgColor} border ${stat.activeBorder} rounded-full`}>
                      <span className={`text-xs font-bold ${stat.iconColor}`}>Active</span>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl sm:text-4xl font-bold ${stat.iconColor}`}>
                  {stat.count}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search Bar - Larger Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
        </div>

        {/* Data Tables - Clean White Background */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
        </div>
      </main>
    </div>
  );
}