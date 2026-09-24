import { useState } from 'react';
import { Layout } from '../../components/common/Layout';

interface SubmissionRecord {
  id: string;
  fileNumber: string;
  customerName: string;
  primaryPhone: string;
  address: string;
  communityName: string;
  gpsCoordinates: string;
  idType: string;
  idNumber: string;
  kitSerialNumber: string;
  selectedOfferTitle: string;
  agreementDate: string;
  orangeShop: string;
  installerName: string;
  installerContact: string;
  customerSignatureUrl?: string;
  thumbprintPhotoUrl?: string;
  installerSignatureUrl?: string;
}

const SAMPLE_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'SUB-2026-001',
    fileNumber: 'FN-90218',
    customerName: 'Josephine Dennis',
    primaryPhone: '0778123456',
    address: 'Tubman Boulevard, House #42',
    communityName: 'Sinkor',
    gpsCoordinates: '6.315600, -10.807400',
    idType: 'National ID (NIR)',
    idNumber: 'NIR-8891204',
    kitSerialNumber: 'OE-KIT-88231',
    selectedOfferTitle: 'Essential Plus Revamp',
    agreementDate: '2026-09-22',
    orangeShop: 'Sinkor Main Shop',
    installerName: 'Emmanuel Koffa',
    installerContact: '0770123456',
  },
];

export const SubmittedForms = () => {
  const [submissions] = useState<SubmissionRecord[]>(SAMPLE_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Submitted Contracts & Forms</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review completed Orange Energy subscription contracts, signatures, and biometric records.
          </p>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4">File / Contract ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Selected Offer</th>
                  <th className="p-4">Kit Serial Number</th>
                  <th className="p-4">Installer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">View Contract</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-orange-600">
                      {sub.fileNumber || sub.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{sub.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {sub.primaryPhone} • {sub.communityName}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{sub.selectedOfferTitle}</td>
                    <td className="p-4 font-mono text-slate-600">{sub.kitSerialNumber}</td>
                    <td className="p-4 text-slate-700">{sub.installerName}</td>
                    <td className="p-4 text-slate-500">{sub.agreementDate}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        View Full Form
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Detail Viewer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  Contract Document
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedSubmission.customerName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Form Section 1 */}
            <div className="space-y-2">
              <div className="bg-orange-500 text-white font-extrabold text-xs uppercase px-3 py-2 rounded-md">
                1. Customer Identification
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-400 block text-[10px]">Full Name</span><strong>{selectedSubmission.customerName}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Phone</span><strong>{selectedSubmission.primaryPhone}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Community</span><strong>{selectedSubmission.communityName}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Address</span><strong>{selectedSubmission.address}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">GPS</span><strong>{selectedSubmission.gpsCoordinates || 'N/A'}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">ID Details</span><strong>{selectedSubmission.idType} - {selectedSubmission.idNumber}</strong></div>
              </div>
            </div>

            {/* Form Section 2 */}
            <div className="space-y-2">
              <div className="bg-orange-500 text-white font-extrabold text-xs uppercase px-3 py-2 rounded-md">
                2. Device & Energy Offer
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-400 block text-[10px]">Kit Serial</span><strong className="font-mono text-orange-600">{selectedSubmission.kitSerialNumber}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Selected Offer</span><strong>{selectedSubmission.selectedOfferTitle}</strong></div>
              </div>
            </div>

            {/* Form Section 3 & 4 */}
            <div className="space-y-2">
              <div className="bg-orange-500 text-white font-extrabold text-xs uppercase px-3 py-2 rounded-md">
                3. Administrative Details
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-400 block text-[10px]">File Number</span><strong>{selectedSubmission.fileNumber}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Agreement Date</span><strong>{selectedSubmission.agreementDate}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Orange Shop</span><strong>{selectedSubmission.orangeShop}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Installer Name</span><strong>{selectedSubmission.installerName}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Installer Phone</span><strong>{selectedSubmission.installerContact}</strong></div>
              </div>
            </div>

            {/* Form Section 5: Signatures & Biometrics */}
            <div className="space-y-2">
              <div className="bg-orange-500 text-white font-extrabold text-xs uppercase px-3 py-2 rounded-md">
                4. Signatures & Biometrics
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Customer Signature</span>
                  <div className="h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                    [Signature Signed]
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Thumbprint Photo</span>
                  <div className="h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                    [Thumbprint Captured]
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Installer Signature</span>
                  <div className="h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                    [Installer Signed]
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-black text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                🖨️ Export / Print PDF
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};