/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-05 10:22:29
 * @Description:
 */
import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
  });

  const params = {
    AccelerateConfiguration: {
      Status: "Enabled",
    },
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NEMA!,
  };
  s3.putBucketAccelerateConfiguration(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });

  const post = await s3.createPresignedPost({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NEMA!,
    Fields: {
      key: req.query.file,
      "Content-Type": req.query.fileType,
    },
    Expires: 30, // seconds
    Conditions: [
      ["content-length-range", 0, 2097152], // up to 2 MB
    ],
  });

  res.status(200).json(post);
}
