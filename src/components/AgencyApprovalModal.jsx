import React from 'react';

const AgencyApprovalModal = ({ isOpen, onClose, agencyData }) => {
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'active':
        return (
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Application Under Review',
          message: 'Your agency application is currently being reviewed by our team. We will notify you once a decision has been made.',
          action: 'Please check back later or contact support for updates.'
        };
      case 'active':
        return {
          title: 'Agency Approved',
          message: 'Congratulations! Your agency application has been approved.',
          action: 'You can now access your agency dashboard.'
        };
      case 'rejected':
        return {
          title: 'Application Not Approved',
          message: agencyData?.agency?.application?.message || 'Your agency application was not approved.',
          action: 'Please contact support for more information or to reapply.'
        };
      default:
        return {
          title: 'Application Status',
          message: 'Your application status is being processed.',
          action: ''
        };
    }
  };

  const status = agencyData?.agency?.status || 'pending';
  const isApproved = agencyData?.agency?.application?.isApproved || false;
  const statusInfo = getStatusMessage(status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon(status)}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {statusInfo.title}
          </h2>

          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Agency Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Agency Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Agency Name:</span>
                <span className="font-medium text-gray-900">{agencyData?.agency?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration No:</span>
                <span className="font-medium text-gray-900">{agencyData?.agency?.registrationNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{agencyData?.agency?.type || 'N/A'}</span>
              </div>
              {agencyData?.agency?.createdOn && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Applied On:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(agencyData.agency.createdOn.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-3">
              {statusInfo.message}
            </p>
            {statusInfo.action && (
              <p className="text-sm text-gray-500 text-center italic">
                {statusInfo.action}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === 'pending' && (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:support@tarag.com'}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Contact Support
                </button>
              </>
            )}
            {status === 'rejected' && (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:support@tarag.com'}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Contact Support
                </button>
              </>
            )}
            {status === 'active' && isApproved && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Continue to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyApprovalModal;
