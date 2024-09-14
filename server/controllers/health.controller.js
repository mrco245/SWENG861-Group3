

//healthz

export const health = (req, res) => {
  res.json({
    message: "Api is working",
  });
};