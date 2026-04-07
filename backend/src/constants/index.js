const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const APPLICATION_STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

const DEFAULT_STATUS = 'new';

const SOURCE_WEBSITE = 'website';

module.exports = {
  ACCEPTED_MIME_TYPES,
  ACCEPTED_EXTENSIONS,
  APPLICATION_STATUSES,
  DEFAULT_STATUS,
  SOURCE_WEBSITE,
};
