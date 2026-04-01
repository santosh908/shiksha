import React, { useState, useEffect } from 'react';
import { Download, Users, TrendingUp, Award, Filter, Settings, Plus, FileText, BarChart3, Beaker } from 'lucide-react';
import axios from 'axios';
import AllDevoteeList from './AllDevoteeList';
import DevoteeNextLevel from './DevoteeNextLevel';

  const reportTypes = [
    { id: 'AllDevotee', label: 'List of All Devotees', icon: Users, description: 'Complete list of all registered devotees with their all information' },
    { id: 'NextLevel', label: 'Next Level for Devotees', icon: TrendingUp, description: 'Shows devotees list and their next level' },
  ];

const report = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [devoteeData, setDevoteeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`/Action/getReport/${selectedReport}`);
        setDevoteeData(res.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedReport) fetchData();
  }, [selectedReport]);

  const handleReportSelect = (reportId: string) => {
    setSelectedReport(reportId);
    setShowMenu(false);
  };

  const handleCustomReport = () => {
    setShowCustomReportModal(true);
    setShowMenu(false);
  };

  const getFilteredData = () => {
    let data = [...devoteeData];

    switch (selectedReport) {
      case 'AllDevotee':
        return data;
      case 'NextLevel':
        return data;
      default:
        return [];
    }
  };
const selected = reportTypes.find(rt => rt.id === selectedReport)!;
  const renderReportComponent = () => {
    switch (selectedReport) {
      case 'AllDevotee':
        return <AllDevoteeList data={getFilteredData()} reportType={selected} />;
      case 'NextLevel':
        return <DevoteeNextLevel data={getFilteredData()} reportType={selected} />;
      default:
        return null;
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white ">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShikshaApp Reports</h1>
          <p className="text-gray-600">Generate and export detailed reports about devotee progress and achievements</p>
        </div>
        {/* Settings + Reset Menu */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Reports</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
                    Standard Reports
                  </div>
                  {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                      <button
                        key={report.id}
                        onClick={() => handleReportSelect(report.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <IconComponent className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.label}</div>
                          <div className="text-xs text-gray-500">{report.description}</div>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={handleCustomReport}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <Plus className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Custom Report</div>
                        <div className="text-xs text-gray-500">Create your own custom report</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Reset Report Button */}
          <button
            onClick={() => setSelectedReport("")}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            title="Reset Report"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.418-5v5h-.582M4 19v-5h.582m15.418 5v-5h-.582M12 8v8m0 0l-4-4m4 4l4-4" /></svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Default Instructions Page */}
      {!selectedReport && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Generate Reports</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to generate comprehensive devotee reports with detailed analytics and export capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Select Report Type</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Click the "Reports" button in the top-right corner to access the report menu. Choose from standard reports or create a custom one.
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <Settings className="w-4 h-4 mr-2" />
                Use the Reports menu
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Use the search functionality to filter devotees by name, level, or location. Apply additional filters as needed.
              </p>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <Filter className="w-4 h-4 mr-2" />
                Refine your results
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">View Data</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Review the generated report in an organized table format with color-coded levels and status indicators.
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" />
                Analyze the data
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Download your report as a CSV file for further analysis, sharing, or integration with other systems.
              </p>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Report Types</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {reportTypes.map((report) => {
                const IconComponent = report.icon;
                return (
                  <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">{report.label}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Custom Reports</span>
              </div>
              <p className="text-sm text-green-700">
                Create personalized reports with custom filters, date ranges, and specific data fields to meet your unique requirements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
            <p className="text-gray-600 mb-6">
              Custom report functionality will be available soon. You can create reports with specific filters, date ranges, and custom fields.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCustomReportModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCustomReportModal(false);
                  // Future: Implement custom report logic
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {selectedReport && (
        <div>
          {renderReportComponent()}
        </div>
      )}

      {/* Instructions */}
      {!selectedReport && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Select a report type from the options above</li>
            <li>• Use the search filter to find specific devotees</li>
            <li>• Click "Export CSV" to download the report data</li>
            <li>• All reports include different views of devotee progress and qualifications</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default report;