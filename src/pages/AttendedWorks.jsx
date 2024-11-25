import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { IoIosArrowBack } from "react-icons/io";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import LoadingSpinner from "../components/LoadingSpinner";

const AttendedWorks = () => {
  const { id } = useParams();
  const [allAttendedWorks, setAllAttendedWorks] = useState({});
  const [workDetails, setWorkDetails] = useState({
    workTitle: "",
    workLocation: "",
    workDescription: "",
    customerName: "",
    customerPhone: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [allAttendedWorks]);

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAllAttendedWorks(data.allAttendedWorks);
    }
    setLoading(false);
  };

  const onSave = async (e, wid) => {
    e.preventDefault();
    const docRef = doc(db, "users", id);

    if (workDetails && workDetails.workDescription !== "") {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const allAttendedWorks = data.allAttendedWorks || [];

          const workIndex = allAttendedWorks.findIndex(
            (work) => work.id === wid
          );
          if (workIndex !== -1) {
            const updatedWork = { ...workDetails, lastEdited: new Date() };
            const updatedAllAttendedWorks = [
              ...allAttendedWorks.slice(0, workIndex),
              updatedWork,
              ...allAttendedWorks.slice(workIndex + 1),
            ];

            await updateDoc(docRef, {
              allAttendedWorks: updatedAllAttendedWorks,
            });
            setToast({
              show: true,
              message: "Work updated successfully!",
              variant: "success",
            });
            setWorkDetails({
              workTitle: "",
              workLocation: "",
              workDescription: "",
              customerName: "",
              customerPhone: "",
            });
          } else {
            // alert("Work not found.");
            setToast({
              show: true,
              message: "Work not found.",
              variant: "danger",
            });
          }
        }
      } catch (error) {
        console.error("Error saving work:", error);
        // alert("Failed to save work. Please try again.");
        setToast({
          show: true,
          message: "Failed to save work. Please try again.",
          variant: "danger",
        });
      }
    } else {
      // alert("Please fill in the work description before saving.");
      setToast({
        show: true,
        message: "Please fill in the work description before saving.",
        variant: "danger",
      });
    }
  };

  const markAsCompleted = async (e, work) => {
    e.preventDefault();
    const docRef = doc(db, "users", id);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allAttendedWorks = data.allAttendedWorks || [];
        const allCompletedWorks = data.allCompletedWorks || [];

        const workIndex = allAttendedWorks.findIndex((w) => w.id === work.id);
        if (workIndex !== -1) {
          const [completedWork] = allAttendedWorks.splice(workIndex, 1);

          allCompletedWorks.push({
            ...completedWork,
            completedAt: new Date(),
          });

          await updateDoc(docRef, {
            allAttendedWorks: allAttendedWorks,
            allCompletedWorks: allCompletedWorks,
          });

          // alert("Work marked as completed successfully!");
          setToast({
            show: true,
            message: "Work marked as completed successfully!",
            variant: "success",
          });
        } else {
          // alert("Work not found in pending works.");
          setToast({
            show: true,
            message: "Work not found in pending works.",
            variant: "danger",
          });
        }
      }
    } catch (error) {
      console.error("Error marking work as completed:", error);
      // alert("Failed to mark work as completed. Please try again.");
      setToast({
        show: true,
        message: "Failed to mark work as completed. Please try again.",
        variant: "danger",
      });
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="m-3">
          <Link to={`/dashboard/${id}`} style={{ textDecoration: "none" }}>
            <button className="btn btn-warning d-flex align-items-center gap-2 my-4">
              <IoIosArrowBack style={{ fontSize: "24px" }} /> Back to Dashboard
            </button>
          </Link>
          <h3>All Attended Works</h3>

          {/* Toast Container */}
          <ToastContainer position="top-end" className="p-3">
            <Toast
              onClose={() => setToast({ ...toast, show: false })}
              show={toast.show}
              delay={3000}
              autohide
              bg={toast.variant === "success" ? "success" : "danger"}
            >
              <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
          </ToastContainer>

          {/* CARDS */}
          <div className="d-flex flex-wrap gap-3 p-3">
            {allAttendedWorks?.length > 0 ? (
              allAttendedWorks?.map((work, index) => (
                <div
                  key={index}
                  className="card border-danger mb-3"
                  style={{ width: "25rem" }}
                >
                  <div className="card-header">
                    Created :{" "}
                    {work?.createdAt?.toDate().toLocaleString("en-US", {
                      hour12: true,
                    })}{" "}
                    <br />
                    Last Edited :{" "}
                    {work?.lastEdited?.toDate().toLocaleString("en-US", {
                      hour12: true,
                    })}
                    <br />
                    Attended :{" "}
                    {work?.attendedAt?.toDate().toLocaleString("en-US", {
                      hour12: true,
                    })}
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{work?.workTitle}</h4>
                    <p className="card-text">Location : {work?.workLocation}</p>
                    <p className="card-text">
                      Customer Name : {work?.customerName}
                    </p>
                    <p className="card-text">
                      Customer Phone : {work?.customerPhone}
                    </p>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Add Work Description"
                      defaultValue={work?.workDescription}
                      onChange={(e) =>
                        setWorkDetails({
                          ...workDetails,
                          workDescription: e.target.value,
                          createdAt: work?.createdAt,
                          attendedAt: work?.attendedAt,
                          workTitle: work?.workTitle,
                          workLocation: work?.workLocation,
                          customerName: work?.customerName,
                          customerPhone: work?.customerPhone,
                          lastEdited: new Date(),
                        })
                      }
                    />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={(e) => onSave(e, work?.id)}
                        type="button"
                        className="btn btn-outline-danger w-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => markAsCompleted(e, work)}
                        type="button"
                        className="btn btn-success w-100"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-danger" role="alert">
                No Attended works found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AttendedWorks;
