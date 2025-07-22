export interface SearchNoteProps {
  title?: string;
  startDate?: string;
  endDate?: string;
  customerId: string;
}

export interface Note {
  id: number;
  project: string;
  title: string;
  createDate: string;
  customerId: string;
  customer: {
    name: string;
    company: string;
    customerId: string;
  };
  attendees: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  noteExpand: Array<{
    id: number;
    name: string;
    description: string;
    conclude: string;
  }>;
  noteAttachment: Array<{
    id: number;
    name: string;
    url: string;
  }>;
}
