export const handler = () => {
  console.log('Hello, world!');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: '{}',
  };
};
