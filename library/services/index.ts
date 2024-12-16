import createAPI from './createInstance';

export const ExampleAPI = createAPI({ env: 'APP_EXAMPLE_API', prefix: '/api' });

export const ApprovalAPI = createAPI({
  env: 'APP_PROJECT_APPROVAL_API',
  prefix: '/api/approval',
});

export const TicketAPI = createAPI({
  env: 'APP_TICKET_API',
  prefix: '/ticket',
});
