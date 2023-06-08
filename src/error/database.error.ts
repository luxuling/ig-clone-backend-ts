const databaseErrorHandler = (err: any) => {
  if (err.code === 11000) {
    return {
      status: 400,
      data: {
        token: null,
        message: `Duplicate error at ${
          Object.values(err.keyValue)[0]
        }. Please try diferent ${Object.keys(err.keyPattern)[0]}`,
      },
    };
  } else {
    return {
      status: 400,
      data: {
        message: 'Undefinded Error Please try again.',
      },
    };
  }
};

export default databaseErrorHandler;
