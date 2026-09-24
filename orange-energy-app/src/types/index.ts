export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'FIELD_AGENT' | 'REVIEWER';

export type ContractStatus =
  | 'DRAFT'
  | 'READY_FOR_SYNC'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED_FOR_CORRECTION'
  | 'SYNC_FAILED'
  | 'ARCHIVED';

export type SyncState = 'DRAFT' | 'READY_FOR_SYNC' | 'SYNCING' | 'SYNCED' | 'SYNC_FAILED';

export interface UserProfile {
  uid: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  region: string;
  county: string;
  territory: string;
  active: boolean;
  firstLogin: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface OrangeOffer {
  offerId: string;
  name: string;
  category: 'Comfort' | 'Essential' | 'Spot Cash';
  description: string;
  firstPaymentLRD: number;
  monthlyPaymentLRD: number;
  durationMonths: number;
  totalCostLRD: number;
  currency: 'LRD' | 'USD';
  active: boolean;
  version: number;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  customerName: string;
  customerType: 'INDIVIDUAL' | 'COMPANY';
  address: string;
  primaryPhone: string;
  secondaryPhone?: string;
  idType: 'NATIONAL_ID' | 'PASSPORT' | 'VOTER_ID' | 'DRIVER_LICENSE';
  idNumber: string;
  email?: string;
  subscriptionType: 'NEW_SUBSCRIPTION' | 'ADDITIONAL_COMPONENTS';
  installationAddress: string;
  numberOfKits: number;
  orangeSimNumber: string;
  orangeMoneyNumber: string;
  region: string;
  county: string;
  cityTown: string;
  community: string;
  installationCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    capturedAt: string;
  };
}

export interface CustomerPreferences {
  receiveOrangeMarketingInfo: boolean;
  receiveElectronicInvoice: boolean;
}

export interface LegalAcceptance {
  termsVersion: string;
  accepted: boolean;
  acceptedAt: string;
  acceptedByIp?: string;
  legalTextReference: string;
}

export interface AdminDetails {
  fileNumber?: string;
  dateOfReceipt?: string;
  dateOfServiceActivation?: string;
  orangeShop: string;
  agentName: string;
  agentContact: string;
  agentId: string;
  region: string;
  county: string;
  territory: string;
  supervisorName?: string;
  submissionDate: string;
  reviewStatus: ContractStatus;
  reviewerUid?: string;
  reviewerName?: string;
  reviewDate?: string;
  reviewComments?: string[];
}

export interface SignatureMetadata {
  customerSignatureUrl?: string;
  customerSignatureBlobKey?: string;
  customerSignedAt?: string;
  agentSignatureUrl?: string;
  agentSignatureBlobKey?: string;
  agentSignedAt?: string;
}

export interface BiometricVerificationRecord {
  status: 'VERIFIED' | 'FAILED' | 'SKIPPED' | 'NOT_SUPPORTED';
  method: 'WEBAUTHN' | 'HARDWARE_SDK' | 'DEVICE_PASSKEY' | 'NONE';
  verifiedAt?: string;
  verificationReference?: string;
  consentObtained: boolean;
}

export interface EnergySubscription {
  id: string;
  contractNumber?: string;
  idempotencyKey: string;
  customerId?: string;
  customerInformation: CustomerInfo;
  selectedOfferSnapshot: OrangeOffer;
  preferences: CustomerPreferences;
  legalAcceptance: LegalAcceptance;
  administrativeDetails: AdminDetails;
  signatures: SignatureMetadata;
  biometricVerification: BiometricVerificationRecord;
  status: ContractStatus;
  syncStatus: SyncState;
  syncError?: string;
  createdByUid: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  formVersion: 'V4';
  appVersion: string;
}

export interface AuditLog {
  auditId?: string;
  action: string;
  userId: string;
  userEmail: string;
  targetId: string;
  timestamp: string;
  deviceId?: string;
  appVersion: string;
  metadata: Record<string, unknown>;
}