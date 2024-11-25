import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import { IoIosArrowBack } from "react-icons/io";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import LoadingSpinner from "../components/LoadingSpinner";

const CompletedWorks = () => {
  const { id } = useParams();
  const [allCompletedWorks, setAllCompletedWorks] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [allCompletedWorks]);

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAllCompletedWorks(data.allCompletedWorks);
      setLoading(false);
    }
    
  };

  const onDelete = async (e, wid) => {
    e.preventDefault();
    const docRef = doc(db, "users", id);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allCompletedWorks = data.allCompletedWorks || [];

        const updatedAllCompletedWorks = allCompletedWorks.filter(
          (work) => work.id !== wid
        );

        await updateDoc(docRef, {
          allCompletedWorks: updatedAllCompletedWorks,
        });

        setAllCompletedWorks(updatedAllCompletedWorks);
        // alert("Work item deleted successfully!");
        setToast({
          show: true,
          message: "Work item deleted successfully!",
          variant: "success",
        });
      } else {
        // alert("Document does not exist.");
        setToast({
          show: true,
          message: "Document does not exist.",
          variant: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting work item:", error);
      // alert("Failed to delete work item. Please try again.");
      setToast({
        show: true,
        message: "Failed to delete work item. Please try again.",
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
          <h3>All Completed Works</h3>

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
            {allCompletedWorks?.length > 0 ? (
              allCompletedWorks?.map((work, index) => (
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
                    <br />
                    Completed :{" "}
                    {work?.completedAt?.toDate().toLocaleString("en-US", {
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
                    />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={(e) => onDelete(e, work?.id)}
                        type="button"
                        className="btn btn-danger w-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-danger" role="alert">
                No completed works found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CompletedWorks;
