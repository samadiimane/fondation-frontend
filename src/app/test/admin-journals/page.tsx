"use client";

import {useEffect} from "react";

import {listJournals} from "@/lib/api/adminJournals";

const AdminJournalsTestPage = () => {
  useEffect(() => {
    const run = async () => {
      try {
        const payload = await listJournals({pageSize: 5});
        console.log("[admin journals] list payload", payload);
      } catch (error) {
        console.error("[admin journals] list error", error);
      }
    };

    void run();
  }, []);

  return (
    <div style={{padding: "2rem"}}>
      <p>Admin Journals test page. Open the console to inspect the API response.</p>
    </div>
  );
};

export default AdminJournalsTestPage;
