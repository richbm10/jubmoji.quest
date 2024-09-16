import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CampaignConsoleProps {
  password: string;
}

export default function CampaignConsole({ password }: CampaignConsoleProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [proofType, setProofType] = useState("IN_COLLECTION");
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch("/api/dev_campaigns");
      const campaigns = await response.json();
      setCampaigns(campaigns);
    };

    fetchCampaigns();
  }, []);

  const handleSubmit = async () => {
    const formData = {
      name,
      description,
      startTime,
      endTime,
      proofType,
    };

    try {
      const response = await fetch("/api/dev_campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const responseData = await response.json();
      setCampaigns((prevCampaigns) => [...prevCampaigns, responseData]);

      setName("");
      setDescription("");
      setStartTime(new Date());
      setEndTime(new Date());
      setProofType("IN_COLLECTION");
    } catch (error) {
      console.error("There was an error submitting the form!", error);

      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert(`Error: ${String(error)}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-xl font-bold mb-4">Create a Campaign</h1>
      <div className="flex flex-col space-y-4">
        <input
          className="border py-2 px-3 text-grey-darkest"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="border py-2 px-3 text-grey-darkest"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="startTime"
          >
            Start Time
          </label>
          <DatePicker
            selected={startTime}
            onChange={(date: Date) => setStartTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="endTime"
          >
            End Time
          </label>
          <DatePicker
            selected={endTime}
            onChange={(date: Date) => setEndTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label>Proof Type:</label>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value)}
          >
            <option value="IN_COLLECTION">In Collection</option>
            <option value="IN_COLLECTION_NONCE">In Collection Nonce</option>
            <option value="N_UNIQUE_IN_COLLECTION">
              N Unique In Collection
            </option>
            <option value="LEADERBOARD">Leaderboard</option>
            <option value="TEAM_LEADERBOARD">Team Leaderboard</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Create Campaign
        </button>
      </div>

      {/* List of campaigns */}
      <div>
        <h2 className="text-lg font-bold mb-3">Campaigns</h2>
        <div className="bg-white">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border mb-4">
              <h3>{`Campaign ID: ${campaign.id} - ${campaign.name}`}</h3>
              <p>Description: {campaign.description}</p>
              <p>
                Start Time:{" "}
                {campaign.startTime &&
                  new Date(campaign.startTime).toLocaleString()}
              </p>
              <p>
                End Time:{" "}
                {campaign.endTime &&
                  new Date(campaign.endTime).toLocaleString()}
              </p>
              <p>Proof Type: {campaign.proofType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}