import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import PageLayout from "../../common/PageLayout";
import Footer from "../../common/Footer";
import * as Activities from "../../api/activities";
import { XMLUploader } from "../xml/XMLUploader";
import { useAuthentication } from "../authentication";

const ActivityListPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user] = useAuthentication();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const activities = await Activities.getAll();
        setActivities(activities);

        console.log("Fetched data is: ", activities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setError("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;


  return (
    <PageLayout>
      <section>
      {user && user.role == "admin" && (
        <div className="rounded min-h-16 p-2">
          <h2 className="text-center">Upload Activities</h2>
          <XMLUploader
            uploadUrl={"/activities/upload-xml"}
            onUploadSuccess={() => {
              Activities.getAll().then((activities) =>
                setActivities(activities)
              );
            }}
          />
        </div>
      )}
      </section>
      <section className="my-8 grid grid-cols-1 gap-6">
        <h2 className="text-3xl font-bold text-center mb-6">Our Activities</h2>
        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              name={activity.name}
              description={activity.description}
            />
          ))}
        </div>
      </section>

    </PageLayout>
  );
};

export default ActivityListPage;
