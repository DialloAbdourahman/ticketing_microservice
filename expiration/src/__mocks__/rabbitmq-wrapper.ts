export const rabbitMqWrapper = {
  client: {
    createChannel: jest.fn().mockImplementation(() => {
      return {
        assertExchange: jest.fn().mockImplementation(() => {
          return true;
        }),

        publish: jest.fn().mockImplementation(() => {
          return true;
        }),
      };
    }),
  },
};
