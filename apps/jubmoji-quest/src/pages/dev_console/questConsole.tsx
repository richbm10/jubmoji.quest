import { JubmojiQuest, QuestBuilder } from "@/types";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function QuestConsole({ password }: { password: string }) {
  const [quests, setQuests] = useState<JubmojiQuest[]>([]);

  // Instantiate the builder
  const [builder, setBuilder] = useState<QuestBuilder>(new QuestBuilder());

  // Fetch quests from API on mount
  useEffect(() => {
    const fetchQuests = async () => {
      const response = await fetch("/api/quests");
      const quests = await response.json();
      setQuests(quests);
    };

    fetchQuests();
  }, []);

  const handleSubmit = async () => {
    try {
      const quest = builder.build(); // Build the quest from the builder
      const response = await fetch("/api/dev_quests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, ...quest }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // After successful creation, re-fetch the list of quests
      const fetchQuests = async () => {
        const response = await fetch("/api/quests");
        const quests = await response.json();
        setQuests(quests);
      };

      fetchQuests();
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  // Update builder when form inputs change
  const updateBuilder = (key: keyof QuestBuilder, value: any) => {
    setBuilder((prevBuilder) => {
      const newBuilder = new QuestBuilder({ ...prevBuilder });
      (newBuilder as any)[key](value);
      return newBuilder;
    });
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-xl font-bold mb-4">Create a Quest</h1>
      <div className="flex flex-col space-y-4">
        <input
          className="border py-2 px-3 text-grey-darkest"
          type="text"
          placeholder="Name"
          value={builder.name || ""}
          onChange={(e) => updateBuilder("setName", e.target.value)}
        />
        <textarea
          className="border py-2 px-3 text-grey-darkest"
          placeholder="Description"
          value={builder.description || ""}
          onChange={(e) => updateBuilder("setDescription", e.target.value)}
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
            Start Time
          </label>
          <DatePicker
            selected={builder.startTime || new Date()}
            onChange={(date: Date) => updateBuilder("setStartTime", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
            End Time
          </label>
          <DatePicker
            selected={builder.endTime || new Date()}
            onChange={(date: Date) => updateBuilder("setEndTime", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <span>Is official quest</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => updateBuilder("setIsOfficial", !builder.isOfficial)}
          >
            {builder.isOfficial ? "Yes" : "No"}
          </button>
        </div>
        <div>
          <span>Is always visible quest</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => updateBuilder("setIsAlwaysVisible", !builder.isAlwaysVisible)}
          >
            {builder.isAlwaysVisible ? "Yes" : "No"}
          </button>
        </div>

        {/* Input for Prerequisite Card Indices */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prerequisiteCardIndices">
            Prerequisite Card Indices (comma-separated) (used as team card indices for team leaderboard)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="prerequisiteCardIndices"
            type="text"
            value={builder.prerequisiteCardIndices.join(",")}
            onChange={(e) => updateBuilder("setPrerequisiteCardIndices", e.target.value.split(",").map(Number))}
            placeholder="e.g., 1,2,3"
          />
        </div>

        {/* Input for Collection Card Indices */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="collectionCardIndices">
            Collection Card Indices (comma-separated)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="collectionCardIndices"
            type="text"
            value={builder.collectionCardIndices.join(",")}
            onChange={(e) => updateBuilder("setCollectionCardIndices", e.target.value.split(",").map(Number))}
            placeholder="e.g., 4,5,6"
          />
        </div>
        <div>
          <label>Proof Type:</label>
          <select
            value={builder.proofType}
            onChange={(e) => updateBuilder("setProofType", e.target.value)}
          >
            <option value="IN_COLLECTION">In Collection</option>
            <option value="IN_COLLECTION_NONCE">In Collection Nonce</option>
            <option value="N_UNIQUE_IN_COLLECTION">N Unique In Collection</option>
            <option value="LEADERBOARD">Leaderboard</option>
            <option value="TEAM_LEADERBOARD">Team Leaderboard</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>
        {builder.proofType === "N_UNIQUE_IN_COLLECTION" && (
          <input
            type="number"
            placeholder="Enter N"
            value={builder.N || ""}
            onChange={(e) => updateBuilder("setN", parseInt(e.target.value))}
          />
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Create Quest
        </button>
      </div>

      {/* List of quests */}
      <div>
        <h2 className="text-lg font-bold mb-3">Quests</h2>
        <div className="bg-white">
          {quests.map((quest) => (
            <div key={quest.id} className="p-4 border mb-4">
              <h3>{`Quest ID: ${quest.id} - ${quest.name}`}</h3>
              <p>Description: {quest.description}</p>
              <p>
                Start Time: {quest.startTime && new Date(quest.startTime).toLocaleString()}
              </p>
              <p>
                End Time: {quest.endTime && new Date(quest.endTime).toLocaleString()}
              </p>
              <p>Is Official: {quest.isOfficial.toString()}</p>
              <p>Is Always Visible: {quest.isAlwaysVisible.toString()}</p>
              <p>Proof Type: {quest.proofType}</p>
              <p>
                Prerequisite Cards: {quest.prerequisiteCards.map((card) => card.index).join(", ")}
              </p>
              <p>
                Collection Cards: {quest.collectionCards.map((card) => card.index).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
