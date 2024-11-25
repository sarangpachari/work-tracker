import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [workDetails, setWorkDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [workDetails]);

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
      setLoading(false);
    }
  };

  const workWithTimestamp = {
    id: uuidv4(),
    ...workDetails,
    createdAt: new Date(),
  };

  const handleSaveWork = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", id);

    const workToSave = {
      ...workWithTimestamp,
      workDescription: workDetails.workDescription || "Nil",
      customerName: workDetails.customerName || "Nil",
      customerPhone: workDetails.customerPhone || "Nil",
    };

    if (!workDetails.workTitle || !workDetails.workLocation) {
      setToast({
        show: true,
        message: "Please fill in Work Title and Location",
        variant: "danger",
      });
    } else {
      try {
        await updateDoc(docRef, {
          allPendingWorks: arrayUnion(workToSave),
        });

        // console.log("Work saved");
        setWorkDetails({});
        handleClose();
        setToast({
          show: true,
          message: "Work saved successfully!",
          variant: "success",
        });
      } catch (error) {
        console.error("Error saving work:", error);
        setToast({
          show: true,
          message: "Failed to save work. Please try again.",
          variant: "danger",
        });
      }
    }
  };

  return (
    <>
      {/* SPINNER */}
      {loading ? (
        <div
          style={{ height: "100px" }}
          className="d-flex justify-content-center align-items-center m-5"
        >
          <Spinner animation="grow" size="sm" variant="dark" />
          <Spinner animation="grow" variant="dark" />
          <Spinner animation="grow" size="sm" variant="dark" />
        </div>
      ) : (
        <div className="m-3" style={{ height: "68vh" }}>
          <h6>Welcome to {user?.shopName} Dashboard</h6>
          <div className="w-100  my-3">
            <button onClick={handleShow} className="btn btn-outline-primary">
              Add Works
            </button>
          </div>

          {/* CARDS */}
          <div className="my-5">
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
              {/* PENDING WORKS DIV */}
              <Link
                to={`/pending-works/${id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card text-white bg-danger mb-3"
                  style={{ maxWidth: "20rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      Pending Works{" "}
                      <span className="bg-white text-primary p-2">
                        {user?.allPendingWorks?.length}
                      </span>
                    </h5>
                  </div>
                </div>
              </Link>
              {/* ATTENDED WORKS DIV */}
              <Link
                to={`/attended-works/${id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card text-white bg-warning mb-3"
                  style={{ maxWidth: "20rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      Attended Works{" "}
                      <span className="bg-white text-primary p-2">
                        {user?.allAttendedWorks?.length}
                      </span>
                    </h5>
                  </div>
                </div>
              </Link>
              {/* COMPLETED WORKS DIV */}
              <Link
                to={`/completed-works/${id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card text-white bg-success mb-3"
                  style={{ maxWidth: "20rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      Completed Works{" "}
                      <span className="bg-white text-primary p-2">
                        {user?.allCompletedWorks?.length}
                      </span>
                    </h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

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

      {/* MODAL FOR ADD WORK */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* FORM TO WORK DETAILS */}
          <div className="">
            <div className="form-floating">
              <input
                onChange={(e) =>
                  setWorkDetails({ ...workDetails, workTitle: e.target.value })
                }
                type="text"
                id="workTit"
                placeholder="Work Title"
                className="form-control"
                required
              />
              <label htmlFor="workTit">Work Title</label>
            </div>
            <div className="form-floating">
              <input
                onChange={(e) =>
                  setWorkDetails({
                    ...workDetails,
                    workLocation: e.target.value,
                  })
                }
                type="text"
                id="workLoc"
                placeholder="Work Location"
                className="mt-3 form-control"
                required
              />
              <label for="workLoc">Work Location</label>
            </div>
            <div className="form-floating">
              <input
                onChange={(e) =>
                  setWorkDetails({
                    ...workDetails,
                    customerName: e.target.value,
                  })
                }
                type="text"
                id="cusName"
                placeholder="Customer Name"
                className="mt-3 form-control"
              />
              <label for="cusName">Customer Name</label>
            </div>
            <div className="form-floating">
              <input
                onChange={(e) =>
                  setWorkDetails({
                    ...workDetails,
                    customerPhone: e.target.value,
                  })
                }
                type="text"
                id="cusPhone"
                placeholder="Customer Phone"
                className="mt-3 form-control"
              />
              <label htmlFor="cusPhone">Customer Phone</label>
            </div>
            <div className="form-floating">
              <textarea
                onChange={(e) =>
                  setWorkDetails({
                    ...workDetails,
                    workDescription: e.target.value,
                  })
                }
                type="text"
                id="workDes"
                placeholder="Work Description"
                className="mt-3 form-control"
              />
              <label htmlFor="workDes">Work Description</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleSaveWork(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
