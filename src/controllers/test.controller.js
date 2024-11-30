import express from "express";

export const test = (req, res) => {
  const { userid } = req.params;
  const query = req.query;
  console.log("userid=", userid, "\n", " query=", query.token);

  res.status(200).json({
    message: "Your server is running perfectly!!!",
  });
};
