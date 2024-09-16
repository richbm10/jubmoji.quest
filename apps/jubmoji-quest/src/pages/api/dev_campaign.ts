import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      password,
      name,
      description,
      startTime,
      endTime,
      proofType,
    } = req.body;

    if (password !== process.env.DEV_CONSOLE_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const campaignData = {
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        merkleRootHash: "", // Placeholder for now
        proofType,
      };

      // Create the campaign
      const newCampaign = await prisma.campaign.create({
        data: campaignData,
      });

      // Return the created campaign
      res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
    
      let errorMessage = "Error creating campaign";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      res.status(500).json({ error: errorMessage });
    }
  } else if (req.method === "GET") {
    try {
      const campaigns = await prisma.campaign.findMany();
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Error fetching campaigns" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}