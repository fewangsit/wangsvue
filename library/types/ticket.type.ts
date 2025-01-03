export type TicketTaskIdResponse = {
  status: number;
  message: string;
  data: TicketTaskId[];
};

export type TicketTaskId = {
  _id: string;
  ticketId: string;
  status: TicketStatus;
  subject: string;
  deadline: string;
};

export type TicketStatus =
  | 'Open'
  | 'On Verification'
  | 'Request Cancel'
  | 'On Progress'
  | 'Need Confirmation'
  | 'Closed'
  | 'Cancel Ticket';
