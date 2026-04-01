import { PageProps } from "@/types";
import { Link,  router,  usePage } from "@inertiajs/react";
import { Button, Modal } from "@mantine/core";
import { useEffect, useState } from "react";

export default function TakeExam() {
  // Extracting exam details from props
  const { examDetails } = usePage<PageProps>().props;
  const exam_details = Array.isArray(examDetails)
    ? examDetails
    //@ts-ignore
    : (Object.values(examDetails) as Record<string, unknown>[]);

  // State to manage button enabled/disabled
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to show the current time
  const [currentTime, setCurrentTime] = useState("");

  // Target date and time for enabling the button
  const targetDateTime = new Date("2024-12-22T15:31:00"); // Set your desired target date and time here

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // Update the current time display
      const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Enable button if the current time is past the target time
      setIsButtonEnabled(now >= targetDateTime);
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [targetDateTime]);

  // Function to trigger full-screen mode
  const enableFullScreen = () => {
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
      //@ts-ignore
    } else if (docElement.mozRequestFullScreen) {
        //@ts-ignore
      docElement.mozRequestFullScreen(); // Firefox
      //@ts-ignore
    } else if (docElement.webkitRequestFullscreen) {
        //@ts-ignore
      docElement.webkitRequestFullscreen(); // Chrome, Safari, Opera
      //@ts-ignore
    } else if (docElement.msRequestFullscreen) {
        //@ts-ignore
      docElement.msRequestFullscreen(); // IE/Edge
    }
  };

  const handleStartTest = (id: string) => {
      const encodedId = btoa(id); 
      router.visit(`/Devotee/StartExam/${encodedId}`);
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        flexDirection: "column",
      }}
    >

      <p style={{ marginBottom: "20px", fontSize: "1.2rem", color: "#555" }}>
        Current Time: {currentTime}
      </p>

      <p><b>Exam will be started: {exam_details[0].date+' '+exam_details[0].start_time}</b></p>

      {/* "Let's Go" Button */}
      <Button
        disabled={!isButtonEnabled}
        onClick={() => setIsModalOpen(true)}
        style={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          backgroundColor: isButtonEnabled ? "#1D4ED8" : "#A5B4FC",
          color: "#fff",
          cursor: isButtonEnabled ? "pointer" : "not-allowed",
        }}
      >
        Let's Go
      </Button>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        size="sm" // Adjust modal size to small
        withCloseButton={false}
        styles={{
            //@ts-ignore
          modal: {
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "20px",
            borderRadius: "10px",
          },
          body: { fontSize: "1.1rem" },
        }}
      >
        <h1>Warning!</h1>
        <p>Are you sure you want to start the test?</p>
        <Button
            component="a"
            style={{
              marginTop: "20px",
              backgroundColor: "#f44336",
              color: "#fff",
            }}
            onClick={() => {
                //enableFullScreen();
                handleStartTest(exam_details[0].id);
              }}
          >
            Start Test
          </Button>
      </Modal>
    </div>
  );
}
