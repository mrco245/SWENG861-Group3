

//healthz
export const health = (req, res) => {
  res.json({
    message: "App is working",
  });
};