import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faFileText, 
  faCalendar, 
  faUsers, 
  faTrash, 
  faUpload, 
  faFilePdf,
  faPlus,
  faEdit,
  faEye,
  faDownload,
  faShare,
  faTimes,
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
  faSearch,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faBars,
  faHome,
  faUser,
  faSignOutAlt,
  faCog,
  faBell,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faTag,
  faFolder,
  faFolderOpen,
  faSave,
  faPrint,
  faCopy,
  faLink,
  faExternalLinkAlt,
  faHeart,
  faStar,
  faThumbsUp,
  faThumbsDown,
  faComment,
  faReply,
  faForward,
  faPaperclip,
  faImage,
  faVideo,
  faMusic,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileCode,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileWord,
  faFilePowerpoint,
  faFileCsv,
  faFileInvoice,
  faFileContract,
  faFileSignature,
  faFileMedical,
  faFileInvoiceDollar,
  faFilePrescription
} from '@fortawesome/free-solid-svg-icons';

import { 
  faFileAlt as faFileAltRegular,
  faCalendarAlt,
  faUser as faUserRegular,
  faEnvelope as faEnvelopeRegular,
  faHeart as faHeartRegular,
  faStar as faStarRegular,
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
  faComment as faCommentRegular,
  faEye as faEyeRegular,
  faEdit as faEditRegular,
  faTrashAlt,
  faSave as faSaveRegular,
  faClock as faClockRegular,
  faCalendar as faCalendarRegular,
  faFile as faFileRegular,
  faFolder as faFolderRegular,
  faFolderOpen as faFolderOpenRegular
} from '@fortawesome/free-regular-svg-icons';

// เพิ่มไอคอนทั้งหมดเข้า library
library.add(
  // Solid Icons
  faFileText, faCalendar, faUsers, faTrash, faUpload, faFilePdf,
  faPlus, faEdit, faEye, faDownload, faShare, faTimes, faCheck,
  faExclamationTriangle, faInfoCircle, faSearch, faFilter, faSort,
  faSortUp, faSortDown, faChevronLeft, faChevronRight, faChevronDown,
  faChevronUp, faBars, faHome, faUser, faSignOutAlt, faCog, faBell,
  faEnvelope, faPhone, faMapMarkerAlt, faClock, faTag, faFolder,
  faFolderOpen, faSave, faPrint, faCopy, faLink, faExternalLinkAlt,
  faHeart, faStar, faThumbsUp, faThumbsDown, faComment, faReply,
  faForward, faPaperclip, faImage, faVideo, faMusic, faFile,
  faFileAlt, faFileArchive, faFileAudio, faFileCode, faFileExcel,
  faFileImage, faFileVideo, faFileWord, faFilePowerpoint, faFileCsv,
  faFileInvoice, faFileContract, faFileSignature, faFileMedical,
  faFileInvoiceDollar, faFilePrescription,
  
  // Regular Icons
  faFileAltRegular, faCalendarAlt, faUserRegular, faEnvelopeRegular,
  faHeartRegular, faStarRegular, faThumbsUpRegular, faThumbsDownRegular,
  faCommentRegular, faEyeRegular, faEditRegular, faTrashAlt,
  faSaveRegular, faClockRegular, faCalendarRegular, faFileRegular,
  faFolderRegular, faFolderOpenRegular
);

// Export ไอคอนที่ใช้บ่อย
export const icons = {
  // Basic Icons
  fileText: faFileText,
  calendar: faCalendar,
  users: faUsers,
  trash: faTrash,
  upload: faUpload,
  plus: faPlus,
  edit: faEdit,
  eye: faEye,
  download: faDownload,
  share: faShare,
  times: faTimes,
  check: faCheck,
  
  // Navigation Icons
  chevronLeft: faChevronLeft,
  chevronRight: faChevronRight,
  chevronDown: faChevronDown,
  chevronUp: faChevronUp,
  bars: faBars,
  home: faHome,
  
  // User Icons
  user: faUser,
  signOut: faSignOutAlt,
  cog: faCog,
  bell: faBell,
  
  // Communication Icons
  envelope: faEnvelope,
  phone: faPhone,
  comment: faComment,
  reply: faReply,
  forward: faForward,
  
  // File Icons
  file: faFile,
  fileAlt: faFileAlt,
  filePdf: faFilePdf,
  fileWord: faFileWord,
  fileExcel: faFileExcel,
  filePowerpoint: faFilePowerpoint,
  fileImage: faFileImage,
  fileVideo: faFileVideo,
  fileAudio: faFileAudio,
  fileArchive: faFileArchive,
  fileCode: faFileCode,
  fileCsv: faFileCsv,
  fileInvoice: faFileInvoice,
  fileContract: faFileContract,
  fileSignature: faFileSignature,
  fileMedical: faFileMedical,
  fileInvoiceDollar: faFileInvoiceDollar,
  filePrescription: faFilePrescription,
  
  // Action Icons
  save: faSave,
  print: faPrint,
  copy: faCopy,
  link: faLink,
  externalLink: faExternalLinkAlt,
  paperclip: faPaperclip,
  
  // Feedback Icons
  heart: faHeart,
  star: faStar,
  thumbsUp: faThumbsUp,
  thumbsDown: faThumbsDown,
  
  // Status Icons
  exclamationTriangle: faExclamationTriangle,
  infoCircle: faInfoCircle,
  
  // Search & Filter Icons
  search: faSearch,
  filter: faFilter,
  sort: faSort,
  sortUp: faSortUp,
  sortDown: faSortDown,
  
  // Location & Time Icons
  mapMarker: faMapMarkerAlt,
  clock: faClock,
  tag: faTag,
  
  // Folder Icons
  folder: faFolder,
  folderOpen: faFolderOpen,
  
  // Media Icons
  image: faImage,
  video: faVideo,
  music: faMusic
}; 